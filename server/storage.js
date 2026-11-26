/**
 * CHRISTMAS FEUD — ATOMIC DISK PERSISTENCE & SAFE SCHEMA MIGRATION
 * Persists active rooms, scores, transactions, and custom edited question banks
 * so browser refreshes and server restarts preserve progress.
 * Automatically migrates pre-upgrade room snapshots safely without data loss.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR =
  process.env.CFF_DATA_DIR ||
  (process.env.VERCEL ? path.join('/tmp', 'christmas-feud-data') : path.join(__dirname, 'runtime-data'));
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function serializeRoom(room) {
  return {
    schemaVersion: 2,
    roomId: room.roomId,
    adminToken: room.adminToken,
    adminPin: room.adminPin,
    hostToken: room.hostToken,
    hostPin: room.hostPin,
    locked: room.locked,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    version: room.version,
    view: room.view,
    edition: room.edition,
    editionBanks: room.editionBanks,
    fastMoneyBank: room.fastMoneyBank,
    teams: room.teams,
    currentRoundIndex: room.currentRoundIndex,
    revealedSlots: room.revealedSlots,
    roundPoints: room.roundPoints,
    roundPointsTransferred: room.roundPointsTransferred,
    transferredToTeam: room.transferredToTeam,
    transactions: room.transactions,
    settings: room.settings,
    winnerOverride: room.winnerOverride,
    celebrationNonce: room.celebrationNonce,
    lastBuzz: room.lastBuzz,
    strikeEvent: room.strikeEvent,
    revealEvent: room.revealEvent,
    playerGuesses: room.playerGuesses,
    fastMoney: room.fastMoney,
    backups: room.backups,
    participants: Array.from(room.participants.values()).map((p) => ({
      ...p,
      connected: false
    }))
  };
}

function hydrateRoom(raw) {
  const participants = new Map();
  if (Array.isArray(raw.participants)) {
    for (const p of raw.participants) {
      participants.set(p.id, { ...p, connected: false });
    }
  }

  // Safe migration from v1 schema: preserve scores, banks, and settings cleanly!
  const migrated = {
    schemaVersion: 2,
    ...raw,
    adminToken: raw.adminToken || raw.hostToken || crypto.randomBytes(24).toString('hex'),
    adminPin: raw.adminPin || raw.hostPin || String(crypto.randomInt(100000, 999999)),
    hostToken: raw.hostToken || crypto.randomBytes(24).toString('hex'),
    hostPin: raw.hostPin || String(crypto.randomInt(100000, 999999)),
    backups: Array.isArray(raw.backups) ? raw.backups : [],
    participants,
    clients: new Set()
  };

  // Migrate legacy Fast Money items to include category & notes & manualPoints
  if (Array.isArray(migrated.fastMoneyBank)) {
    migrated.fastMoneyBank = migrated.fastMoneyBank.map((q) => ({
      ...q,
      category: q.category || 'Christmas Food and Drinks',
      notes: typeof q.notes === 'string' ? q.notes : ''
    }));
  }
  if (migrated.fastMoney) {
    if (migrated.fastMoney.phase === 'p2_done' || migrated.fastMoney.phase === 'results') {
      migrated.fastMoney.phase = 'scoring';
    }
    if (typeof migrated.fastMoney.manualBonusPoints !== 'number') {
      migrated.fastMoney.manualBonusPoints = 0;
    }
    if (Array.isArray(migrated.fastMoney.p1Submissions)) {
      migrated.fastMoney.p1Submissions = migrated.fastMoney.p1Submissions.map((s) => ({
        ...s,
        manualPoints: Number(s.manualPoints ?? s.points ?? 0) || 0,
        skipped: Boolean(s.skipped)
      }));
    }
    if (Array.isArray(migrated.fastMoney.p2Submissions)) {
      migrated.fastMoney.p2Submissions = migrated.fastMoney.p2Submissions.map((s) => ({
        ...s,
        manualPoints: Number(s.manualPoints ?? s.points ?? 0) || 0,
        skipped: Boolean(s.skipped)
      }));
    }
  }

  return migrated;
}

let saveTimer = null;

function saveRoomsNow(roomsMap) {
  try {
    ensureDir();
    const payload = {};
    for (const [id, room] of roomsMap.entries()) {
      payload[id] = serializeRoom(room);
    }
    const tmp = `${ROOMS_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(payload), 'utf8');
    fs.renameSync(tmp, ROOMS_FILE);
  } catch (err) {
    console.error('[storage] Failed to persist rooms:', err.message);
  }
}

function scheduleSaveRooms(roomsMap) {
  if (process.env.VERCEL) {
    saveRoomsNow(roomsMap);
    return;
  }
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveRoomsNow(roomsMap);
  }, 350);
  if (saveTimer.unref) saveTimer.unref();
}

function loadRooms() {
  const map = new Map();
  try {
    if (!fs.existsSync(ROOMS_FILE)) return map;
    const rawText = fs.readFileSync(ROOMS_FILE, 'utf8').trim();
    if (!rawText) return map;
    const parsed = JSON.parse(rawText);
    for (const [id, rawRoom] of Object.entries(parsed)) {
      if (rawRoom && rawRoom.roomId) {
        map.set(id, hydrateRoom(rawRoom));
      }
    }
  } catch (err) {
    console.error('[storage] Failed to load persisted rooms:', err.message);
  }
  return map;
}

module.exports = {
  loadRooms,
  saveRoomsNow,
  scheduleSaveRooms
};
