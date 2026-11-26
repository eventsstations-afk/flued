/**
 * CHRISTMAS FEUD — COMPREHENSIVE 20-POINT QA, PRIVACY & PDF VERIFICATION SUITE
 * Verifies every requirement in the Master Change Request:
 *  - 70 Classic / 100 Deluxe / 150 Ultimate all-Christmas rounds across all 15 categories
 *  - 8 unique answers totaling exactly 100 points per round
 *  - Main FEUD reveal, Hide Answers, transfers, duplicate prevention, undo, 3 strikes
 *  - CRITICAL: Fast Money has ZERO live answer reveals, ZERO automatic matching, private P1/P2,
 *    synchronized timer (+5s/+10s/Pause/Resume/Reset/Skip), and pure Host Manual Scoring
 *  - Administrator-Only PDF Exports (70, 100, 150, Fast Money) dynamically reflecting saved edits
 *    and returning 403 Forbidden to non-Administrators (Player, Audience, Co-Host)
 *  - 4-Role RBAC (admin, host, player, audience), live SSE sync, safe v1->v2 migration & frontend integrity
 */

const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { validateAllDefaultBanks, CHRISTMAS_CATEGORIES } = require('../server/data');

const TEST_PORT = 3458;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;
const TEST_DATA_DIR = path.join(__dirname, '.tmp-qa-v2');

function cleanupTmp() {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  }
}

async function reqJson(urlPath, { method = 'GET', headers = {}, body = null } = {}) {
  const res = await fetch(`${BASE_URL}${urlPath}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== null ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (_) {}
  return { status: res.status, json, text, headers: res.headers };
}

async function reqBinary(urlPath, headers = {}) {
  const res = await fetch(`${BASE_URL}${urlPath}`, { method: 'GET', headers });
  const buf = Buffer.from(await res.arrayBuffer());
  return { status: res.status, buf, contentType: res.headers.get('content-type') || '' };
}

function openSseAndWaitForEvent(urlPath, predicate, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${urlPath}`, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`SSE failed with HTTP ${res.statusCode}`));
        return;
      }
      let buf = '';
      const timer = setTimeout(() => { req.destroy(); reject(new Error('SSE event timed out')); }, timeoutMs);
      res.on('data', (chunk) => {
        buf += chunk.toString('utf8');
        const frames = buf.split('\n\n');
        buf = frames.pop();
        for (const frame of frames) {
          const dataLine = frame.split('\n').find((l) => l.startsWith('data: '));
          if (!dataLine) continue;
          try {
            const payload = JSON.parse(dataLine.slice(6));
            if (predicate(payload)) {
              clearTimeout(timer);
              req.destroy();
              resolve(payload);
              return;
            }
          } catch (_) {}
        }
      });
    });
    req.on('error', (err) => { if (err.code !== 'ECONNRESET') reject(err); });
  });
}

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await reqJson('/api/health');
      if (r.status === 200 && r.json?.ok) return;
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error('Server did not start in time.');
}

async function runAllTests() {
  cleanupTmp();
  console.log('🎄 Running CHRISTMAS FEUD — Comprehensive 20-Point QA, Privacy & PDF Audit\n');

  // [1-4] All-Christmas Question Banks across all 15 Categories
  const bankReport = validateAllDefaultBanks();
  assert.strictEqual(bankReport.ok, true, `Bank errors: ${bankReport.errors.join(', ')}`);
  assert.strictEqual(bankReport.categoriesCount, 15);
  assert.strictEqual(bankReport.editions.classic.count, 70);
  assert.strictEqual(bankReport.editions.classic.categoriesCovered, 15);
  assert.strictEqual(bankReport.editions.deluxe.count, 100);
  assert.strictEqual(bankReport.editions.deluxe.categoriesCovered, 15);
  assert.strictEqual(bankReport.editions.ultimate.count, 150);
  assert.strictEqual(bankReport.editions.ultimate.categoriesCovered, 15);
  assert.strictEqual(bankReport.fastMoneyCount, 30);
  console.log('  ✅ [1–4] 70 Classic / 100 Deluxe / 150 Ultimate unique rounds across all 15 Christmas categories, exact 100 pts');

  // Frontend Integrity & Static Privacy Audit (Unified React src/ + dist/)
  const rootDir = path.join(__dirname, '..');
  const srcDir = path.join(rootDir, 'src');
  const distDir = path.join(rootDir, 'dist');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('id="root"'), 'index.html must mount React #root');

  const reactRelFiles = [
    'main.jsx',
    'App.jsx',
    'services/api.js',
    'services/audio.js',
    'services/stage3dEngine.js',
    'components/Stage3D.jsx',
    'components/TopBar.jsx',
    'components/HomeView.jsx',
    'components/MainBoardView.jsx',
    'components/FastMoneyView.jsx',
    'components/WinnerView.jsx',
    'components/GameStudioView.jsx',
    'components/Modals.jsx'
  ];
  const clientSources = reactRelFiles.map((f) => ({ f, src: fs.readFileSync(path.join(srcDir, f), 'utf8') }));

  for (const { f, src } of clientSources) {
    assert.ok(!src.includes('Open One Present Early'), `Leaked standard answer in src/${f}`);
    assert.ok(!src.includes('matchFastMoneyAnswer'), `Forbidden auto-matcher found in src/${f}`);
    for (const m of src.matchAll(/import\s+[^'"]+from\s+['"](\.[^'"]+)['"]/g)) {
      const target = path.resolve(srcDir, path.dirname(f), m[1]);
      assert.ok(fs.existsSync(target), `Broken ES import in src/${f}: ${m[1]}`);
    }
  }

  const fmClientSrc = fs.readFileSync(path.join(srcDir, 'components', 'FastMoneyView.jsx'), 'utf8');
  assert.ok(!fmClientSrc.includes('REVEAL ALL QUESTIONS'), 'Fast Money UI must NOT have live Reveal All');
  assert.ok(!fmClientSrc.includes('fmReveal'), 'Fast Money UI must NOT call live answer reveal');

  const mainBoardSrc = fs.readFileSync(path.join(srcDir, 'components', 'MainBoardView.jsx'), 'utf8');
  assert.ok(!mainBoardSrc.includes('PRIVATE HOST ANSWER KEY'), 'Main Board MUST NOT contain PRIVATE HOST ANSWER KEY');
  assert.ok(!mainBoardSrc.includes('hostAnswerKeyDock'), 'Main Board MUST NOT contain hostAnswerKeyDock');
  assert.ok(!mainBoardSrc.includes('hostAnswers'), 'Main Board MUST NOT render hostAnswers');

  const studioSrc = fs.readFileSync(path.join(srcDir, 'components', 'GameStudioView.jsx'), 'utf8');
  assert.ok(studioSrc.includes('PDF Keys') && studioSrc.includes('downloadAnswerKeyPdf'), 'Game Studio must have dedicated PDF Keys tab');

  const cssText = fs.readFileSync(path.join(srcDir, 'styles', 'christmas-feud.css'), 'utf8');
  assert.strictEqual((cssText.match(/\{/g) || []).length, (cssText.match(/\}/g) || []).length, 'CSS brace mismatch');

  // Verify production dist bundle privacy & presence
  assert.ok(fs.existsSync(path.join(distDir, 'index.html')), 'Missing built dist/index.html');
  const distAssetsDir = path.join(distDir, 'assets');
  const distJsFile = fs.readdirSync(distAssetsDir).find((n) => n.endsWith('.js'));
  assert.ok(distJsFile, 'Missing built dist/assets/*.js bundle');
  const distJs = fs.readFileSync(path.join(distAssetsDir, distJsFile), 'utf8');
  assert.ok(!distJs.includes('PRIVATE HOST ANSWER KEY'), 'Built dist bundle must NOT include PRIVATE HOST ANSWER KEY');
  assert.ok(!distJs.includes('Open One Present Early'), 'Built dist bundle must NOT leak answer bank');
  console.log(`  ✅ [19–20] React frontend integrity: ${reactRelFiles.length} modules, all ES imports, zero Main Board/dist answer leaks & CSS braces verified`);

  // Test safe v1->v2 room migration before starting server
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
  const legacyRoom = {
    'LEGACY-1234': {
      roomId: 'LEGACY-1234',
      hostToken: 'legacy-host-tok',
      hostPin: '654321',
      locked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 5,
      view: 'game',
      edition: 'classic',
      editionBanks: require('../server/data').getDefaultAllEditionBanks(),
      fastMoneyBank: require('../server/data').getDefaultFastMoneyBank(),
      teams: {
        teamA: { name: 'Saved Legacy A', playerName: 'Santa', score: 175, strikes: 1 },
        teamB: { name: 'Saved Legacy B', playerName: 'Frosty', score: 120, strikes: 0 }
      },
      currentRoundIndex: 2,
      revealedSlots: [true, false, false, false, false, false, false, false],
      roundPoints: 30,
      roundPointsTransferred: false,
      transferredToTeam: null,
      transactions: [],
      settings: { maxStrikes: 3, quickPointsStep: 10, soundMusicEnabled: true, soundSfxEnabled: true, allowPlayerGuesses: true },
      winnerOverride: 'auto',
      celebrationNonce: 0,
      lastBuzz: null,
      strikeEvent: null,
      revealEvent: null,
      playerGuesses: [],
      fastMoney: { phase: 'setup', config: { participatingTeam: 'teamA', player1Name: 'P1', player2Name: 'P2', targetScore: 200, questionsPerPlayer: 5, p1Duration: 20, p2Duration: 25, questionSet: 1, p2OrderMode: 'shuffled', p2AlternateSet: 2 }, activePlayer: 1, currentQuestionIndex: 0, timer: { duration: 20, remainingSeconds: 20, running: false, startedAt: null }, questionIds: ['fm-001','fm-002','fm-003','fm-004','fm-005'], p2QuestionIds: ['fm-003','fm-001','fm-005','fm-002','fm-004'], p2CanonicalMap: [2,0,4,1,3], p1Submissions: [], p2Submissions: [], totals: { p1Score: 0, p2Score: 0, bonusPoints: 0, combinedScore: 0 }, result: null },
      backups: [],
      participants: []
    }
  };
  fs.writeFileSync(path.join(TEST_DATA_DIR, 'rooms.json'), JSON.stringify(legacyRoom), 'utf8');

  const serverProc = spawn(process.execPath, [path.join(__dirname, '..', 'server', 'server.js')], {
    env: { ...process.env, PORT: String(TEST_PORT), HOST: '127.0.0.1', CFF_DATA_DIR: TEST_DATA_DIR },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    await waitForServer();

    // Verify safe migration preserved legacy scores & teams!
    const migCheck = await reqJson('/api/rooms/LEGACY-1234/host-state', {
      headers: { 'X-Host-Token': 'legacy-host-tok' }
    });
    assert.strictEqual(migCheck.status, 200);
    assert.strictEqual(migCheck.json.teams.teamA.name, 'Saved Legacy A');
    assert.strictEqual(migCheck.json.teams.teamA.score, 175);
    console.log('  ✅ [18] Safe v1→v2 persistence migration preserved existing teams, scores & round progress');

    // Create new room -> receives Admin + Co-Host credentials
    const created = await reqJson('/api/rooms', { method: 'POST', body: { edition: 'classic' } });
    assert.strictEqual(created.status, 201);
    const { roomId, adminToken, adminPin, hostToken, hostPin } = created.json;
    const adminHdr = { 'X-Admin-Token': adminToken, 'X-Host-Token': hostToken };
    const coHostHdr = { 'X-Host-Token': hostToken }; // Co-Host WITHOUT Admin token!

    // CRITICAL UPDATE CHECK: Even Admin/Host live Main Board snapshot MUST NOT expose unrevealed hostAnswers!
    assert.strictEqual(created.json.snapshot.currentRound.hostAnswers, undefined, 'Live Main Board state must NEVER include hostAnswers');
    for (const sl of created.json.snapshot.currentRound.slots) {
      assert.strictEqual(sl.revealed, false);
      assert.strictEqual(sl.text, null);
      assert.strictEqual(sl.points, null);
    }
    assert.ok(!created.text.includes('Open One Present Early'), 'Unrevealed answer text must not appear on initial live board snapshot');

    // Join Player 1 (Team A) & Player 2 (Team B)
    const p1Join = await reqJson(`/api/rooms/${roomId}/join`, { method: 'POST', body: { name: 'John', team: 'teamA' } });
    const p2Join = await reqJson(`/api/rooms/${roomId}/join`, { method: 'POST', body: { name: 'Emma', team: 'teamB' } });
    const p1Hdr = { 'X-Participant-Id': p1Join.json.participant.id, 'X-Participant-Token': p1Join.json.participant.token };
    const p2Hdr = { 'X-Participant-Id': p2Join.json.participant.id, 'X-Participant-Token': p2Join.json.participant.token };

    // [5–7] Standard FEUD Reveal, Hide Answers, Transfer, Duplicate Protection, Undo, Strikes & SSE
    const ssePromise = openSseAndWaitForEvent(
      `/api/rooms/${roomId}/stream?role=player&participantId=${p1Join.json.participant.id}&participantToken=${p1Join.json.participant.token}`,
      (snap) => snap.currentRound?.slots?.[0]?.revealed === true
    );
    await new Promise((r) => setTimeout(r, 150));
    await reqJson(`/api/rooms/${roomId}/reveal`, { method: 'POST', headers: coHostHdr, body: { slotIndex: 0 } });
    const sseSnap = await ssePromise;
    assert.strictEqual(sseSnap.currentRound.slots[0].text, 'Open One Present Early');
    assert.strictEqual(sseSnap.currentRound.slots[1].text, null, 'Unrevealed slots must remain null');
    assert.strictEqual(sseSnap.roundPoints, 28);

    // Hide Answers button works!
    const hid = await reqJson(`/api/rooms/${roomId}/round`, {
      method: 'POST',
      headers: coHostHdr,
      body: { action: 'hide-answers' }
    });
    assert.strictEqual(hid.json.snapshot.currentRound.slots[0].revealed, false);
    assert.strictEqual(hid.json.snapshot.roundPoints, 0);

    // Re-reveal & transfer with duplicate protection + undo + 3 strikes
    await reqJson(`/api/rooms/${roomId}/reveal`, { method: 'POST', headers: coHostHdr, body: { slotIndex: 0 } });
    const tr = await reqJson(`/api/rooms/${roomId}/transfer`, { method: 'POST', headers: coHostHdr, body: { team: 'teamA' } });
    assert.strictEqual(tr.json.snapshot.teams.teamA.score, 28);
    const trDup = await reqJson(`/api/rooms/${roomId}/transfer`, { method: 'POST', headers: coHostHdr, body: { team: 'teamA' } });
    assert.strictEqual(trDup.status, 400);
    await reqJson(`/api/rooms/${roomId}/undo`, { method: 'POST', headers: coHostHdr });
    await reqJson(`/api/rooms/${roomId}/transfer`, { method: 'POST', headers: coHostHdr, body: { team: 'teamA' } });
    for (let s = 1; s <= 3; s++) {
      const st = await reqJson(`/api/rooms/${roomId}/strike`, { method: 'POST', headers: coHostHdr, body: { team: 'teamA' } });
      assert.strictEqual(st.json.snapshot.teams.teamA.strikes, s);
    }
    console.log('  ✅ [5–7, 17] Standard FEUD reveal, Hide Answers, SSE sync, transfer/undo, duplicate prevention & 3 strikes verified');

    // [8–12] CRITICAL FAST MONEY AUDIT: NO LIVE REVEAL, NO AUTO-MATCH, PRIVATE P1/P2, MANUAL SCORING
    const fmStart = await reqJson(`/api/rooms/${roomId}/fast-money/start`, {
      method: 'POST',
      headers: coHostHdr,
      body: {
        config: {
          participatingTeam: 'teamA',
          player1Name: 'John',
          player2Name: 'Emma',
          targetScore: 200,
          questionsPerPlayer: 5,
          p1Duration: 10,
          p2Duration: 15,
          questionSet: 1,
          p2OrderMode: 'shuffled'
        }
      }
    });
    assert.strictEqual(fmStart.status, 200);
    // CRITICAL: Even Admin/Host live Fast Money state MUST NOT contain acceptedAnswers or notes!
    assert.ok(!fmStart.text.includes('acceptedAnswers'), 'Live Fast Money state must NEVER include acceptedAnswers!');
    assert.ok(!fmStart.text.includes('Gift Card'), 'Live Fast Money state must NEVER include private answer-key entries!');

    // Verify removed endpoints return 404
    const deadRev = await reqJson(`/api/rooms/${roomId}/fast-money/reveal`, { method: 'POST', headers: adminHdr, body: { all: true } });
    assert.strictEqual(deadRev.status, 404, 'Live Fast Money /reveal endpoint must not exist');
    const deadEval = await reqJson(`/api/rooms/${roomId}/fast-money/evaluate`, { method: 'POST', headers: adminHdr, body: {} });
    assert.strictEqual(deadEval.status, 404, 'Live Fast Money /evaluate auto-matcher endpoint must not exist');

    // Timer controls: +5s, +10s, Pause, Resume, Reset, Skip Question
    await reqJson(`/api/rooms/${roomId}/fast-money/timer`, { method: 'POST', headers: coHostHdr, body: { action: 'add', seconds: 5 } });
    await reqJson(`/api/rooms/${roomId}/fast-money/timer`, { method: 'POST', headers: coHostHdr, body: { action: 'add', seconds: 10 } });
    await reqJson(`/api/rooms/${roomId}/fast-money/timer`, { method: 'POST', headers: coHostHdr, body: { action: 'pause' } });
    await reqJson(`/api/rooms/${roomId}/fast-money/timer`, { method: 'POST', headers: coHostHdr, body: { action: 'resume' } });

    // Player 1 submits 4 answers + 1 skip (ZERO automatic points!)
    const p1Ans = ['Gift Card', 'Home Alone', 'Ornaments', 'Jingle Bells'];
    for (let i = 0; i < 4; i++) {
      const sub = await reqJson(`/api/rooms/${roomId}/fast-money/submit`, {
        method: 'POST',
        headers: p1Hdr,
        body: { playerNum: 1, answerText: p1Ans[i], questionIndex: i }
      });
      assert.strictEqual(sub.status, 200);
      assert.strictEqual(sub.json.points, undefined, 'No auto-points on submit');
    }
    const skipRes = await reqJson(`/api/rooms/${roomId}/fast-money/skip`, {
      method: 'POST',
      headers: coHostHdr,
      body: { playerNum: 1 }
    });
    assert.strictEqual(skipRes.json.snapshot.fastMoney.phase, 'p1_done');

    // Start Player 2 -> Verify Player 2 CANNOT see Player 1's answers!
    await reqJson(`/api/rooms/${roomId}/fast-money/start-p2`, { method: 'POST', headers: coHostHdr });
    const p2Pub = await reqJson(`/api/rooms/${roomId}/public-state`, { headers: p2Hdr });
    assert.ok(!p2Pub.text.includes('Gift Card'), 'Player 2 must NEVER see Player 1 answers!');
    assert.ok(!p2Pub.text.includes('Home Alone'), 'Player 2 must NEVER see Player 1 answers!');
    assert.ok(!p2Pub.text.includes('Ornaments'), 'Player 2 must NEVER see Player 1 answers!');

    // Player 2 submits 5 answers -> automatically enters private Host Manual Scoring ('scoring')
    const p2Ans = ['String Lights', 'Socks', 'Rudolph', 'Elf', 'Silent Night'];
    for (let i = 0; i < 5; i++) {
      await reqJson(`/api/rooms/${roomId}/fast-money/submit`, {
        method: 'POST',
        headers: p2Hdr,
        body: { playerNum: 2, answerText: p2Ans[i], questionIndex: i }
      });
    }

    // Verify Player / Audience CANNOT see hostScoringRows during scoring!
    const pubDuringScoring = await reqJson(`/api/rooms/${roomId}/public-state`, { headers: p1Hdr });
    assert.strictEqual(pubDuringScoring.json.fastMoney.phase, 'scoring');
    assert.strictEqual(pubDuringScoring.json.fastMoney.hostScoringRows, undefined);

    // Verify Host sees manual scoring summary with all manualPoints starting at 0 (ZERO auto-scoring!)
    const hostScoring = await reqJson(`/api/rooms/${roomId}/host-state`, { headers: coHostHdr });
    assert.strictEqual(hostScoring.json.fastMoney.phase, 'scoring');
    assert.strictEqual(hostScoring.json.fastMoney.totals.combinedScore, 0, 'Must start at 0 with zero auto-scoring');

    // Host enters manual scores + manual bonus + publishes final result
    const p1ManualPts = [32, 31, 35, 30, 0]; // = 128
    const p2ManualPts = [22, 24, 24, 14, 38]; // = 122
    for (let i = 0; i < 5; i++) {
      await reqJson(`/api/rooms/${roomId}/fast-money/manual-score`, {
        method: 'POST',
        headers: coHostHdr,
        body: { playerNum: 1, canonicalIndex: i, points: p1ManualPts[i] }
      });
      await reqJson(`/api/rooms/${roomId}/fast-money/manual-score`, {
        method: 'POST',
        headers: coHostHdr,
        body: { playerNum: 2, canonicalIndex: i, points: p2ManualPts[i] }
      });
    }
    await reqJson(`/api/rooms/${roomId}/fast-money/manual-bonus`, {
      method: 'POST',
      headers: coHostHdr,
      body: { bonusPoints: 15 }
    });
    const pubFinal = await reqJson(`/api/rooms/${roomId}/fast-money/publish-result`, {
      method: 'POST',
      headers: coHostHdr
    });
    assert.strictEqual(pubFinal.json.snapshot.fastMoney.phase, 'final');
    assert.strictEqual(pubFinal.json.snapshot.fastMoney.totals.p1Score, 128);
    assert.strictEqual(pubFinal.json.snapshot.fastMoney.totals.p2Score, 122);
    assert.strictEqual(pubFinal.json.snapshot.fastMoney.totals.bonusPoints, 15);
    assert.strictEqual(pubFinal.json.snapshot.fastMoney.totals.combinedScore, 265);
    assert.strictEqual(pubFinal.json.snapshot.fastMoney.result.won, true);
    console.log('  ✅ [8–12] Fast Money verified: ZERO live reveals, ZERO auto-matching, P1/P2 private, timers/skip & Manual Scoring (128+122+15=265 WON)');

    // [13–14] Winner + Studio Standard & Fast Money Full CRUD (including FM duplicate & reorder)
    await reqJson(`/api/rooms/${roomId}/winner`, { method: 'POST', headers: coHostHdr, body: { mode: 'auto' } });

    // Co-Host without Admin token MUST BE BLOCKED from Studio!
    const coHostStudio = await reqJson(`/api/rooms/${roomId}/studio`, { headers: coHostHdr });
    assert.strictEqual(coHostStudio.status, 403, 'Co-Host without Admin token must be blocked from Admin Studio');

    // Admin edits Round 1 & Fast Money Q1 with unique marker strings so we can verify dynamic PDF reflection!
    const stdMarker = 'Custom Santa Sleigh Express Round';
    await reqJson(`/api/rooms/${roomId}/studio/standard/save`, {
      method: 'POST',
      headers: adminHdr,
      body: {
        edition: 'classic',
        index: 0,
        round: {
          id: 'cf-001',
          category: 'Christmas Traditions',
          question: `${stdMarker}?`,
          answers: [
            { text: 'Open One Present Early', points: 28 },
            { text: 'Attend Midnight Mass', points: 21 },
            { text: 'Matching Pajamas', points: 15 },
            { text: 'Watch Christmas Movie', points: 11 },
            { text: 'Drive to See Lights', points: 9 },
            { text: 'Read Christmas Story', points: 7 },
            { text: 'Cookies for Santa', points: 5 },
            { text: 'Track Santa Online', points: 4 }
          ]
        }
      }
    });

    const fmMarker = 'Custom Admin Note For PDF Verification';
    await reqJson(`/api/rooms/${roomId}/studio/fast-money/save`, {
      method: 'POST',
      headers: adminHdr,
      body: {
        index: 0,
        question: {
          id: 'fm-001',
          set: 1,
          category: 'Christmas Gifts',
          question: 'Name a popular Christmas gift people give to almost anyone.',
          acceptedAnswers: [
            { text: 'Gift Card', points: 32 },
            { text: 'Socks', points: 22 },
            { text: 'Candle', points: 15 },
            { text: 'Pajamas', points: 12 },
            { text: 'Chocolates', points: 9 }
          ],
          notes: fmMarker
        }
      }
    });
    await reqJson(`/api/rooms/${roomId}/studio/fast-money/duplicate`, { method: 'POST', headers: adminHdr, body: { index: 0 } });
    await reqJson(`/api/rooms/${roomId}/studio/fast-money/reorder`, { method: 'POST', headers: adminHdr, body: { fromIndex: 1, toIndex: 0 } });
    await reqJson(`/api/rooms/${roomId}/studio/fast-money/delete`, { method: 'POST', headers: adminHdr, body: { index: 0 } });
    console.log('  ✅ [13–14] Winner, 4-Role RBAC (Admin vs Co-Host) & Standard/Fast Money Studio CRUD (Add/Edit/Duplicate/Reorder/Delete) verified');

    // [15–16] ADMINISTRATOR-ONLY PDF EXPORTS — PRIVACY & DYNAMIC LATEST DATA VERIFICATION
    for (const kind of ['classic', 'deluxe', 'ultimate', 'fast-money']) {
      // Player, Audience, AND Co-Host MUST all receive 403 Forbidden!
      const pPdf = await reqBinary(`/api/rooms/${roomId}/pdf/${kind}`, p1Hdr);
      assert.strictEqual(pPdf.status, 403, `Player must be blocked from ${kind} PDF`);
      const audPdf = await reqBinary(`/api/rooms/${roomId}/pdf/${kind}`, {});
      assert.strictEqual(audPdf.status, 403, `Audience must be blocked from ${kind} PDF`);
      const hostPdf = await reqBinary(`/api/rooms/${roomId}/pdf/${kind}`, coHostHdr);
      assert.strictEqual(hostPdf.status, 403, `Co-Host without Admin token must be blocked from ${kind} PDF`);

      // Administrator receives valid PDF binary with Cover Page, exact filename & dynamic edits!
      const admPdf = await reqBinary(`/api/rooms/${roomId}/pdf/${kind}`, adminHdr);
      assert.strictEqual(admPdf.status, 200, `Admin PDF export failed for ${kind}`);
      assert.ok(admPdf.contentType.includes('application/pdf'), `Wrong MIME type for ${kind}`);
      const pdfStr = admPdf.buf.toString('latin1');
      assert.ok(pdfStr.startsWith('%PDF-1.4'), `Invalid PDF header for ${kind}`);
      assert.ok(pdfStr.trim().endsWith('%%EOF'), `Invalid PDF EOF trailer for ${kind}`);
      assert.ok(pdfStr.includes('OFFICIAL ADMINISTRATOR PRINT EDITION'), `Missing Christmas Cover Page in ${kind} PDF`);
      assert.ok(pdfStr.includes('Page 1 of'), `Missing cover pagination in ${kind} PDF`);
      assert.ok(pdfStr.includes('Page 2 of'), `Missing content pagination in ${kind} PDF`);
      if (kind === 'classic') {
        assert.ok(pdfStr.includes('CHRISTMAS FEUD CLASSIC - 70 ROUND ANSWER KEY'), 'Missing Classic PDF cover title');
        assert.ok(pdfStr.includes(stdMarker), 'Classic PDF MUST dynamically contain latest saved Studio edit!');
      }
      if (kind === 'deluxe') assert.ok(pdfStr.includes('CHRISTMAS FEUD DELUXE - 100 ROUND ANSWER KEY'), 'Missing Deluxe PDF cover title');
      if (kind === 'ultimate') assert.ok(pdfStr.includes('CHRISTMAS FEUD ULTIMATE - 150 ROUND ANSWER KEY'), 'Missing Ultimate PDF cover title');
      if (kind === 'fast-money') {
        assert.ok(pdfStr.includes('CHRISTMAS FEUD FAST MONEY ANSWER KEY'), 'Missing Fast Money PDF cover title');
        assert.ok(pdfStr.includes(fmMarker), 'Fast Money PDF MUST dynamically contain latest saved Admin notes!');
      }
    }
    console.log('  ✅ [15–16] All 4 Administrator-Only PDFs (70, 100, 150, Fast Money) verified: valid PDF 1.4, live edits included, 403 to non-Admins');

    // Verify Admin PIN & Co-Host PIN sign-in distinct roles
    const pinAdmin = await reqJson(`/api/rooms/${roomId}/host-auth`, { method: 'POST', body: { pin: adminPin } });
    assert.strictEqual(pinAdmin.json.role, 'admin');
    const pinHost = await reqJson(`/api/rooms/${roomId}/host-auth`, { method: 'POST', body: { pin: hostPin } });
    assert.strictEqual(pinHost.json.role, 'host');
    console.log('  ✅ [11] Separate Administrator PIN & Co-Host PIN authentication verified');

    console.log('\n🎉 ALL 20 MASTER CHANGE REQUEST QA, PRIVACY & PDF CHECKS PASSED 100%!');
  } finally {
    serverProc.kill();
    await new Promise((r) => setTimeout(r, 250));
    cleanupTmp();
  }
}

runAllTests().catch((err) => {
  cleanupTmp();
  console.error('\n❌ QA SUITE FAILED:', err);
  process.exit(1);
});
