/**
 * CHRISTMAS FEUD — THE ULTIMATE CHRISTMAS GAME SHOW
 * Production Online Multiplayer, 4-Role RBAC & Administrator PDF Server
 *
 * Security & Privacy Guarantees:
 * - Static server ONLY serves files strictly inside ../public
 * - 4 distinct server-enforced roles: admin, host, player, audience
 * - Live Fast Money contains ZERO live answer reveals and ZERO automatic answer matching
 * - Private Fast Money answer keys & all 4 Answer Key PDFs are strictly Administrator-only
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const engine = require('./gameEngine');
const { CHRISTMAS_CATEGORIES, GAME_DATA_DISCLAIMER } = require('./data');
const {
  timingSafeEqualStr,
  isValidAdminRequest,
  isValidHostRequest,
  getParticipantFromRequest,
  resolveRequestRole,
  projectRoomForRole
} = require('./privacy');
const { loadRooms, saveRoomsNow, scheduleSaveRooms } = require('./storage');
const { generateStandardAnswerKeyPdf, generateFastMoneyAnswerKeyPdf } = require('./pdfGenerator');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.resolve(__dirname, '..', 'dist');
const ROOM_TTL_MS = 48 * 60 * 60 * 1000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const rooms = loadRooms();

function sendJson(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token, X-Host-Token, X-Participant-Id, X-Participant-Token',
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

function sendPdf(res, filename, buffer) {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, '-');
  const utf8Encoded = encodeURIComponent(filename);
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${asciiFallback}"; filename*=UTF-8''${utf8Encoded}`,
    'Content-Length': buffer.length,
    'Cache-Control': 'no-store, private',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(buffer);
}

function readJsonBody(req, maxBytes = 4 * 1024 * 1024) {
  if (req.body !== undefined) {
    if (typeof req.body === 'object' && req.body !== null) return Promise.resolve(req.body);
    if (typeof req.body === 'string') {
      try { return Promise.resolve(req.body.trim() ? JSON.parse(req.body) : {}); }
      catch (_) { return Promise.reject(new Error('Invalid JSON request body.')); }
    }
  }
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Request payload exceeds maximum allowed size.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8').trim();
        resolve(raw ? JSON.parse(raw) : {});
      } catch (_) {
        reject(new Error('Invalid JSON request body.'));
      }
    });
    req.on('error', reject);
  });
}

function broadcastRoomUpdate(room, eventName = 'state') {
  scheduleSaveRooms(rooms);
  for (const client of room.clients) {
    try {
      const participant = client.participantId ? room.participants.get(client.participantId) : null;
      if (client.role === 'player' && (!participant || participant.kicked)) {
        client.res.write(`event: kicked\ndata: ${JSON.stringify({ reason: 'Removed by host' })}\n\n`);
        client.res.end();
        room.clients.delete(client);
        continue;
      }
      const payload = projectRoomForRole(room, client.role, participant);
      client.res.write(`event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`);
    } catch (_) {
      room.clients.delete(client);
    }
  }
}

function serveStaticFile(req, res, pathname) {
  let cleanPath = pathname === '/' ? '/index.html' : pathname;
  try {
    cleanPath = decodeURIComponent(cleanPath);
  } catch (_) {
    sendJson(res, 400, { error: 'Malformed URL path.' });
    return;
  }
  const resolved = path.resolve(PUBLIC_DIR, `.${cleanPath}`);
  if (!resolved.startsWith(PUBLIC_DIR + path.sep) && resolved !== PUBLIC_DIR) {
    sendJson(res, 403, { error: 'Forbidden path.' });
    return;
  }
  fs.stat(resolved, (err, stats) => {
    if (err || !stats.isFile()) {
      if (!cleanPath.startsWith('/api/') && !path.extname(cleanPath)) {
        const idxPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(idxPath, (idxErr, html) => {
          if (idxErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not Found');
            return;
          }
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
          });
          res.end(html);
        });
        return;
      }
      sendJson(res, 404, { error: 'Resource not found.' });
      return;
    }

    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const cacheHeader = (ext === '.js' && cleanPath.includes('/vendor/')) || cleanPath.startsWith('/assets/')
      ? 'public, max-age=86400'
      : 'no-cache';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheHeader,
      'X-Content-Type-Options': 'nosniff'
    });
    fs.createReadStream(resolved).pipe(res);
  });
}

function requireHostOrAdmin(room, req, res, urlObj) {
  if (!isValidHostRequest(room, req, urlObj)) {
    sendJson(res, 403, { error: 'Forbidden: Host or Administrator authorization required.' });
    return false;
  }
  return true;
}

function requireAdmin(room, req, res, urlObj) {
  if (!isValidAdminRequest(room, req, urlObj)) {
    sendJson(res, 403, { error: 'Forbidden: Administrator authorization strictly required.' });
    return false;
  }
  return true;
}

setInterval(() => {
  const now = Date.now();
  let removed = false;
  for (const [id, room] of rooms.entries()) {
    if (now - room.updatedAt > ROOM_TTL_MS && room.clients.size === 0) {
      rooms.delete(id);
      removed = true;
    }
  }
  if (removed) scheduleSaveRooms(rooms);
}, 30 * 60 * 1000).unref();

async function handleRequest(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token, X-Host-Token, X-Participant-Id, X-Participant-Token'
    });
    res.end();
    return;
  }

  // Health Check
  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      service: 'christmas-feud-ultimate-game-show',
      activeRooms: rooms.size,
      timestamp: Date.now()
    });
    return;
  }

  // Create a new Room (creator becomes Administrator with full Admin + Host access)
  if (req.method === 'POST' && pathname === '/api/rooms') {
    try {
      const body = await readJsonBody(req);
      let roomId = engine.generateRoomCode();
      while (rooms.has(roomId)) roomId = engine.generateRoomCode();
      const room = engine.createRoom({
        roomId,
        edition: body.edition || 'classic',
        teamAName: body.teamAName,
        teamAPlayer: body.teamAPlayer,
        teamBName: body.teamBName,
        teamBPlayer: body.teamBPlayer,
        adminPin: body.adminPin,
        hostPin: body.hostPin
      });
      rooms.set(roomId, room);
      scheduleSaveRooms(rooms);

      const snapshot = projectRoomForRole(room, 'admin', null);
      sendJson(
        res,
        201,
        {
          roomId: room.roomId,
          role: 'admin',
          adminToken: room.adminToken,
          adminPin: room.adminPin,
          hostToken: room.hostToken,
          hostPin: room.hostPin,
          snapshot
        },
        {
          'Set-Cookie': [
            `cff_admin_token=${encodeURIComponent(room.adminToken)}; Path=/; HttpOnly; SameSite=Lax`,
            `cff_host_token=${encodeURIComponent(room.hostToken)}; Path=/; HttpOnly; SameSite=Lax`
          ]
        }
      );
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  // Room routes: /api/rooms/:roomId[/subpath...]
  const roomMatch = pathname.match(/^\/api\/rooms\/([A-Za-z0-9_-]+)(?:\/(.*))?$/);
  if (roomMatch) {
    const roomId = roomMatch[1].toUpperCase();
    const subPath = (roomMatch[2] || '').replace(/\/+$/, '');
    const room = rooms.get(roomId);

    if (!room) {
      sendJson(res, 404, { error: `Room "${roomId}" was not found or has expired.` });
      return;
    }

    try {
      // 1. PUBLIC / SANITIZED SNAPSHOT (Player or Audience — ZERO leaked keys!)
      if (req.method === 'GET' && (subPath === '' || subPath === 'public-state')) {
        const participant = getParticipantFromRequest(room, req, urlObj);
        const role = participant ? participant.role : 'audience';
        sendJson(res, 200, projectRoomForRole(room, role, participant));
        return;
      }

      // 2. HOST / ADMIN SNAPSHOT (Authenticated)
      if (req.method === 'GET' && subPath === 'host-state') {
        if (!requireHostOrAdmin(room, req, res, urlObj)) return;
        const role = isValidAdminRequest(room, req, urlObj) ? 'admin' : 'host';
        sendJson(res, 200, projectRoomForRole(room, role, null));
        return;
      }

      // 3. ADMIN OR HOST PIN SIGN-IN
      if (req.method === 'POST' && subPath === 'host-auth') {
        const body = await readJsonBody(req);
        const pin = String(body.pin || body.hostPin || body.adminPin || '').trim();
        if (pin && timingSafeEqualStr(pin, room.adminPin)) {
          sendJson(
            res,
            200,
            {
              ok: true,
              role: 'admin',
              roomId: room.roomId,
              adminToken: room.adminToken,
              hostToken: room.hostToken,
              snapshot: projectRoomForRole(room, 'admin', null)
            },
            {
              'Set-Cookie': [
                `cff_admin_token=${encodeURIComponent(room.adminToken)}; Path=/; HttpOnly; SameSite=Lax`,
                `cff_host_token=${encodeURIComponent(room.hostToken)}; Path=/; HttpOnly; SameSite=Lax`
              ]
            }
          );
          return;
        }
        if (pin && timingSafeEqualStr(pin, room.hostPin)) {
          sendJson(
            res,
            200,
            {
              ok: true,
              role: 'host',
              roomId: room.roomId,
              hostToken: room.hostToken,
              snapshot: projectRoomForRole(room, 'host', null)
            },
            {
              'Set-Cookie': `cff_host_token=${encodeURIComponent(room.hostToken)}; Path=/; HttpOnly; SameSite=Lax`
            }
          );
          return;
        }
        sendJson(res, 403, { error: 'Invalid Administrator or Host PIN.' });
        return;
      }

      // 4. REAL-TIME SSE STREAM (Strictly role-projected per client!)
      if (req.method === 'GET' && subPath === 'stream') {
        const requestedRole = urlObj.searchParams.get('role') || 'audience';
        let verifiedRole = 'audience';
        let participant = null;

        if (requestedRole === 'admin') {
          if (!isValidAdminRequest(room, req, urlObj)) {
            sendJson(res, 403, { error: 'Forbidden: valid Administrator token required.' });
            return;
          }
          verifiedRole = 'admin';
        } else if (requestedRole === 'host') {
          if (!isValidHostRequest(room, req, urlObj)) {
            sendJson(res, 403, { error: 'Forbidden: valid Host token required.' });
            return;
          }
          verifiedRole = isValidAdminRequest(room, req, urlObj) ? 'admin' : 'host';
        } else {
          participant = getParticipantFromRequest(room, req, urlObj);
          if (participant) {
            verifiedRole = participant.role;
            participant.connected = true;
            participant.lastSeenAt = Date.now();
          } else {
            verifiedRole = 'audience';
          }
        }

        res.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'X-Accel-Buffering': 'no'
        });

        const clientRecord = {
          res,
          role: verifiedRole,
          participantId: participant ? participant.id : null
        };
        room.clients.add(clientRecord);

        res.write(`event: state\ndata: ${JSON.stringify(projectRoomForRole(room, verifiedRole, participant))}\n\n`);
        if (participant) broadcastRoomUpdate(room, 'state');

        const keepAlive = setInterval(() => {
          try {
            res.write(': keepalive\n\n');
          } catch (_) {
            clearInterval(keepAlive);
            room.clients.delete(clientRecord);
          }
        }, 18000);

        req.on('close', () => {
          clearInterval(keepAlive);
          room.clients.delete(clientRecord);
          if (participant) {
            let stillOpen = false;
            for (const c of room.clients) {
              if (c.participantId === participant.id) stillOpen = true;
            }
            if (!stillOpen) {
              participant.connected = false;
              participant.lastSeenAt = Date.now();
              broadcastRoomUpdate(room, 'state');
            }
          }
        });
        return;
      }

      // 5. PLAYER / AUDIENCE JOIN ROOM
      if (req.method === 'POST' && subPath === 'join') {
        const body = await readJsonBody(req);
        const existingId = body.participantId ? String(body.participantId).slice(0, 48) : null;
        const existingToken = body.participantToken ? String(body.participantToken) : null;
        let participant = existingId ? room.participants.get(existingId) : null;

        if (participant) {
          if (participant.kicked) {
            sendJson(res, 403, { error: 'You have been removed from this room by the host.' });
            return;
          }
          if (existingToken && !timingSafeEqualStr(existingToken, participant.token)) {
            participant = null;
          } else {
            if (body.name && String(body.name).trim()) {
              participant.name = String(body.name).trim().slice(0, 32);
            }
            if (['teamA', 'teamB', 'audience'].includes(body.team)) {
              participant.team = body.team;
              participant.role = body.team === 'audience' ? 'audience' : 'player';
            }
            participant.connected = true;
            participant.lastSeenAt = Date.now();
          }
        }

        if (!participant) {
          const requestedTeam = ['teamA', 'teamB', 'audience'].includes(body.team) ? body.team : 'audience';
          if (room.locked && requestedTeam !== 'audience') {
            sendJson(res, 423, { error: 'This room is currently locked by the host.' });
            return;
          }
          const id = `p-${crypto.randomBytes(6).toString('hex')}`;
          const token = engine.generateToken(16);
          const name = String(body.name || (requestedTeam === 'audience' ? 'Audience Display' : 'Guest Player'))
            .trim()
            .slice(0, 32) || 'Guest Player';
          participant = {
            id,
            token,
            name,
            team: requestedTeam,
            role: requestedTeam === 'audience' ? 'audience' : 'player',
            connected: true,
            kicked: false,
            joinedAt: Date.now(),
            lastSeenAt: Date.now()
          };
          room.participants.set(id, participant);
        }

        engine.touchRoom(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, {
          participant: {
            id: participant.id,
            token: participant.token,
            name: participant.name,
            team: participant.team,
            role: participant.role
          },
          snapshot: projectRoomForRole(room, participant.role, participant)
        });
        return;
      }

      // 6. PLAYER BUZZ-IN
      if (req.method === 'POST' && subPath === 'buzz') {
        const participant = getParticipantFromRequest(room, req, urlObj);
        const body = await readJsonBody(req);
        if (!participant && !isValidHostRequest(room, req, urlObj)) {
          sendJson(res, 403, { error: 'Join the room as a player to buzz in.' });
          return;
        }
        const now = Date.now();
        if (room.lastBuzz && now - room.lastBuzz.at < 2500) {
          sendJson(res, 200, { accepted: false, lastBuzz: room.lastBuzz });
          return;
        }
        room.lastBuzz = {
          participantId: participant ? participant.id : 'host',
          name: participant ? participant.name : String(body.name || 'Player').slice(0, 32),
          team: participant ? participant.team : (body.team === 'teamB' ? 'teamB' : 'teamA'),
          at: now
        };
        engine.touchRoom(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { accepted: true, lastBuzz: room.lastBuzz });
        return;
      }

      // 7. PLAYER STANDARD-ROUND GUESS SUBMISSION
      if (req.method === 'POST' && subPath === 'guess') {
        const participant = getParticipantFromRequest(room, req, urlObj);
        if (!participant || participant.role !== 'player') {
          sendJson(res, 403, { error: 'Active player session required.' });
          return;
        }
        const body = await readJsonBody(req);
        const text = String(body.text || '').trim().slice(0, 80);
        if (!text) {
          sendJson(res, 400, { error: 'Guess text cannot be empty.' });
          return;
        }
        room.playerGuesses.push({
          id: `g-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
          participantId: participant.id,
          playerName: participant.name,
          team: participant.team,
          text,
          roundNumber: room.currentRoundIndex + 1,
          at: Date.now()
        });
        if (room.playerGuesses.length > 50) room.playerGuesses.shift();
        engine.touchRoom(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, submitted: true });
        return;
      }

      // 8. FAST MONEY PLAYER SUBMISSION (Pure save & lock — ZERO matching, ZERO answer keys!)
      if (req.method === 'POST' && subPath === 'fast-money/submit') {
        const isHost = isValidHostRequest(room, req, urlObj);
        const participant = getParticipantFromRequest(room, req, urlObj);
        if (!isHost && (!participant || participant.role !== 'player')) {
          sendJson(res, 403, { error: 'Player or Host session required to submit Fast Money answer.' });
          return;
        }
        const body = await readJsonBody(req);
        const playerNum = Number(body.playerNum) === 2 ? 2 : 1;
        const result = engine.submitFastMoneyAnswer(
          room,
          playerNum,
          body.answerText,
          body.questionIndex
        );
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, {
          ok: true,
          locked: result.locked,
          phase: result.phase,
          nextIndex: result.nextIndex,
          snapshot: projectRoomForRole(room, isHost ? (isValidAdminRequest(room, req, urlObj) ? 'admin' : 'host') : participant.role, isHost ? null : participant)
        });
        return;
      }

      // =========================================================================
      // ADMINISTRATOR-ONLY PDF ANSWER KEY EXPORTS (Strictly requires Admin!)
      // =========================================================================
      if (req.method === 'GET' && subPath.startsWith('pdf/')) {
        if (!requireAdmin(room, req, res, urlObj)) return;
        const kind = subPath.slice(4);
        if (kind === 'classic' || kind === 'deluxe' || kind === 'ultimate') {
          const { filename, buffer } = generateStandardAnswerKeyPdf(room, kind);
          sendPdf(res, filename, buffer);
          return;
        }
        if (kind === 'fast-money') {
          const { filename, buffer } = generateFastMoneyAnswerKeyPdf(room);
          sendPdf(res, filename, buffer);
          return;
        }
        sendJson(res, 404, { error: 'Unknown PDF document type.' });
        return;
      }

      // =========================================================================
      // ADMINISTRATOR-ONLY GAME STUDIO API (Strictly requires Admin!)
      // =========================================================================
      if (subPath === 'studio' || subPath.startsWith('studio/')) {
        if (!requireAdmin(room, req, res, urlObj)) return;

        if (req.method === 'GET' && subPath === 'studio') {
          sendJson(res, 200, {
            edition: room.edition,
            categories: CHRISTMAS_CATEGORIES,
            disclaimer: GAME_DATA_DISCLAIMER,
            editionBanks: room.editionBanks,
            fastMoneyBank: room.fastMoneyBank,
            teams: room.teams,
            settings: room.settings,
            fastMoneyConfig: room.fastMoney.config,
            locked: room.locked,
            adminPin: room.adminPin,
            hostPin: room.hostPin,
            backups: room.backups.map((b) => ({ id: b.id, createdAt: b.createdAt, label: b.label }))
          });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/standard/save') {
          const body = await readJsonBody(req);
          const saved = engine.studioSaveStandardRound(room, body.edition || room.edition, body.index, body.round);
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true, round: saved, total: room.editionBanks[body.edition || room.edition].length });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/standard/delete') {
          const body = await readJsonBody(req);
          engine.studioDeleteStandardRound(room, body.edition || room.edition, Number(body.index));
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/standard/duplicate') {
          const body = await readJsonBody(req);
          const copy = engine.studioDuplicateStandardRound(room, body.edition || room.edition, Number(body.index));
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true, copy });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/standard/reorder') {
          const body = await readJsonBody(req);
          engine.studioReorderStandardRound(room, body.edition || room.edition, Number(body.fromIndex), Number(body.toIndex));
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/fast-money/save') {
          const body = await readJsonBody(req);
          const saved = engine.studioSaveFastMoneyQuestion(room, body.index, body.question);
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true, question: saved });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/fast-money/delete') {
          const body = await readJsonBody(req);
          engine.studioDeleteFastMoneyQuestion(room, Number(body.index));
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/fast-money/duplicate') {
          const body = await readJsonBody(req);
          const copy = engine.studioDuplicateFastMoneyQuestion(room, Number(body.index));
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true, copy });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/fast-money/reorder') {
          const body = await readJsonBody(req);
          engine.studioReorderFastMoneyQuestion(room, Number(body.fromIndex), Number(body.toIndex));
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true });
          return;
        }

        if (req.method === 'PUT' && subPath === 'studio/settings') {
          const body = await readJsonBody(req);
          if (body.teamA) engine.updateTeamInfo(room, 'teamA', body.teamA);
          if (body.teamB) engine.updateTeamInfo(room, 'teamB', body.teamB);
          if (body.edition && body.edition !== room.edition) engine.switchEdition(room, body.edition);
          if (body.maxStrikes !== undefined) {
            room.settings.maxStrikes = Math.max(1, Math.min(5, Math.round(Number(body.maxStrikes) || 3)));
          }
          if (body.quickPointsStep !== undefined) {
            room.settings.quickPointsStep = Math.max(1, Math.min(100, Math.round(Number(body.quickPointsStep) || 10)));
          }
          if (body.allowPlayerGuesses !== undefined) room.settings.allowPlayerGuesses = Boolean(body.allowPlayerGuesses);
          if (body.locked !== undefined) room.locked = Boolean(body.locked);
          if (body.adminPin && String(body.adminPin).trim().length >= 4) {
            room.adminPin = String(body.adminPin).trim().slice(0, 16);
          }
          if (body.hostPin && String(body.hostPin).trim().length >= 4) {
            room.hostPin = String(body.hostPin).trim().slice(0, 16);
          }
          if (body.fastMoneyConfig) engine.configureFastMoney(room, body.fastMoneyConfig);
          engine.touchRoom(room);
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, 'admin') });
          return;
        }

        if (req.method === 'GET' && subPath === 'studio/export') {
          sendJson(res, 200, engine.exportStudioBundle(room));
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/import') {
          const body = await readJsonBody(req);
          if (!body.confirmed) {
            sendJson(res, 400, { error: 'Confirmation required before overwriting studio data.' });
            return;
          }
          engine.importStudioBundle(room, body.bundle);
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, 'admin') });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/load-christmas-defaults') {
          const body = await readJsonBody(req);
          if (!body.confirmed) {
            sendJson(res, 400, { error: 'Confirmation required before replacing banks with default All-Christmas pack.' });
            return;
          }
          engine.loadAllChristmasDefaultBanks(room);
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, 'admin') });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/backup') {
          const body = await readJsonBody(req);
          const meta = engine.createStudioBackup(room, body.label);
          scheduleSaveRooms(rooms);
          sendJson(res, 200, { ok: true, backup: meta });
          return;
        }

        if (req.method === 'POST' && subPath === 'studio/restore') {
          const body = await readJsonBody(req);
          if (!body.confirmed) {
            sendJson(res, 400, { error: 'Confirmation required before restoring backup.' });
            return;
          }
          engine.restoreStudioBackup(room, body.backupId);
          broadcastRoomUpdate(room, 'state');
          sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, 'admin') });
          return;
        }

        sendJson(res, 404, { error: `Unknown studio route "${subPath}".` });
        return;
      }

      // =========================================================================
      // HOST / ADMIN LIVE GAMEPLAY ROUTES
      // =========================================================================
      if (!requireHostOrAdmin(room, req, res, urlObj)) return;
      const callerRole = isValidAdminRequest(room, req, urlObj) ? 'admin' : 'host';

      if (req.method === 'POST' && subPath === 'view') {
        const body = await readJsonBody(req);
        if (body.view === 'studio' && callerRole !== 'admin') {
          sendJson(res, 403, { error: 'Administrator authorization required to open Game Studio.' });
          return;
        }
        engine.setView(room, body.view);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'edition') {
        const body = await readJsonBody(req);
        engine.switchEdition(room, body.edition);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'round') {
        const body = await readJsonBody(req);
        if (body.action === 'next') engine.setRound(room, room.currentRoundIndex + 1);
        else if (body.action === 'prev') engine.setRound(room, room.currentRoundIndex - 1);
        else if (body.action === 'hide-answers') engine.hideStandardAnswers(room);
        else if (body.action === 'reset') {
          engine.resetRoundState(room);
          engine.touchRoom(room);
        } else if (body.index !== undefined) {
          engine.setRound(room, body.index);
        } else {
          throw new Error('Provide action (next/prev/hide-answers/reset) or round index.');
        }
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      // Standard FEUD Reveal ONLY (never applies to Fast Money!)
      if (req.method === 'POST' && subPath === 'reveal') {
        const body = await readJsonBody(req);
        if (body.all) engine.revealAllAnswers(room);
        else engine.revealAnswer(room, body.slotIndex);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'transfer') {
        const body = await readJsonBody(req);
        const tx = engine.transferRoundPoints(room, body.team);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, transaction: tx, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'undo') {
        const tx = engine.undoLastTransfer(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, undone: tx, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'score') {
        const body = await readJsonBody(req);
        const tx = engine.adjustTeamScore(room, body.team, body.operation, body.amount, body.note);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, transaction: tx, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'strike') {
        const body = await readJsonBody(req);
        if (body.action === 'reset') engine.resetStrikes(room, body.team || 'both');
        else engine.addStrike(room, body.team);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'clear-buzz') {
        room.lastBuzz = null;
        engine.touchRoom(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'PUT' && subPath === 'teams') {
        const body = await readJsonBody(req);
        if (body.teamA) engine.updateTeamInfo(room, 'teamA', body.teamA);
        if (body.teamB) engine.updateTeamInfo(room, 'teamB', body.teamB);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'winner') {
        const body = await readJsonBody(req);
        if (body.action === 'replay') engine.replayWinnerCelebration(room);
        else if (body.action === 'new-game') engine.startNewGame(room);
        else engine.setWinnerMode(room, body.mode || 'auto');
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'lock') {
        const body = await readJsonBody(req);
        room.locked = Boolean(body.locked);
        engine.touchRoom(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, locked: room.locked, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'kick') {
        const body = await readJsonBody(req);
        const target = room.participants.get(String(body.participantId || ''));
        if (!target) {
          sendJson(res, 404, { error: 'Participant not found.' });
          return;
        }
        target.kicked = true;
        target.connected = false;
        engine.touchRoom(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      // =========================================================================
      // FAST MONEY LIVE CONTROLS (NO ANSWER REVEALS, NO AUTO-MATCHING!)
      // =========================================================================
      if (req.method === 'POST' && subPath === 'fast-money/config') {
        const body = await readJsonBody(req);
        engine.configureFastMoney(room, body);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/start') {
        const body = await readJsonBody(req);
        engine.startFastMoneyRound(room, body.config || null);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/skip') {
        const body = await readJsonBody(req);
        engine.skipFastMoneyQuestion(room, body.playerNum ? Number(body.playerNum) : null);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/lock-turn') {
        const body = await readJsonBody(req);
        engine.lockFastMoneyPlayerTurn(room, Number(body.playerNum) === 2 ? 2 : 1);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/start-p2') {
        engine.startFastMoneyPlayer2(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/timer') {
        const body = await readJsonBody(req);
        engine.adjustFastMoneyTimer(room, body.action, body.seconds);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/manual-score') {
        const body = await readJsonBody(req);
        engine.updateFastMoneyManualScore(room, body);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/manual-bonus') {
        const body = await readJsonBody(req);
        engine.setFastMoneyManualBonus(room, body.bonusPoints);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/publish-result') {
        engine.publishFastMoneyResult(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      if (req.method === 'POST' && subPath === 'fast-money/reset') {
        engine.resetFastMoneyToSetup(room);
        broadcastRoomUpdate(room, 'state');
        sendJson(res, 200, { ok: true, snapshot: projectRoomForRole(room, callerRole) });
        return;
      }

      sendJson(res, 404, { error: `Unknown API route "${subPath}".` });
      return;
    } catch (err) {
      sendJson(res, 400, { error: err.message });
      return;
    }
  }

  if (req.method === 'GET') {
    serveStaticFile(req, res, pathname);
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed.' });
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  process.on('SIGINT', () => {
    saveRoomsNow(rooms);
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    saveRoomsNow(rooms);
    process.exit(0);
  });

  server.listen(PORT, HOST, () => {
    console.log(`🎄 CHRISTMAS FEUD — Ultimate Game Show server running at http://${HOST}:${PORT}`);
  });
}

module.exports = { handleRequest, server };
