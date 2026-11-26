/**
 * CHRISTMAS FEUD — AUTHORITATIVE GAME ENGINE
 * Preserves all existing Classic FEUD mechanics and upgrades:
 *  - All-Christmas 70 / 100 / 150 Editions across 15 categories
 *  - Hide Answers control for Standard FEUD
 *  - CRITICAL: Fast Money contains ZERO live answer reveals and ZERO automatic answer matching.
 *    Live Fast Money handles questions, private player submissions, synchronized timers (+5s/+10s/Pause/Resume/Reset/Skip),
 *    and Host Manual Scoring (manual per-response points, corrections, manual bonus points, final result publish).
 *  - Full Fast Money Question Editor CRUD (Add, Edit, Delete, Duplicate, Reorder, Category, Admin Notes)
 *  - 4-Tier RBAC tokens (adminToken/adminPin + hostToken/hostPin)
 */

const crypto = require('crypto');
const {
  EDITION_META,
  CHRISTMAS_CATEGORIES,
  getDefaultAllEditionBanks,
  getDefaultFastMoneyBank,
  validateStandardRound,
  validateFastMoneyQuestion,
  deepClone
} = require('./data');
const { computeLiveTimer } = require('./privacy');

const ROOM_WORDS = [
  'NOEL', 'HOLLY', 'TINSEL', 'FROST', 'SLEIGH', 'JINGLE',
  'MERRY', 'WINTER', 'FESTIVE', 'WREATH', 'CANDY', 'STAR'
];

function generateRoomCode() {
  const word = ROOM_WORDS[crypto.randomInt(0, ROOM_WORDS.length)];
  const num = crypto.randomInt(1000, 9999);
  return `${word}-${num}`;
}

function generateToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('hex');
}

function generatePin() {
  return String(crypto.randomInt(100000, 999999));
}

function buildP2Order(p1Ids, mode, fastMoneyBank, alternateSet = 2) {
  const count = p1Ids.length;
  if (mode === 'same') {
    return {
      ids: [...p1Ids],
      canonicalIndices: p1Ids.map((_, i) => i)
    };
  }
  if (mode === 'alternate_set') {
    const alt = fastMoneyBank.filter((q) => Number(q.set) === Number(alternateSet) && !p1Ids.includes(q.id));
    const fallback = fastMoneyBank.filter((q) => !p1Ids.includes(q.id));
    const chosen = (alt.length >= count ? alt : fallback).slice(0, count);
    if (chosen.length === count) {
      return {
        ids: chosen.map((q) => q.id),
        canonicalIndices: chosen.map((_, i) => i)
      };
    }
  }
  // Default: same questions in a different order
  const indices = p1Ids.map((_, i) => i);
  if (count >= 2) {
    const reordered = [];
    const shift = Math.max(1, Math.floor(count / 2));
    for (let i = 0; i < count; i++) {
      reordered.push(indices[(i + shift) % count]);
    }
    if (count >= 4) {
      const tmp = reordered[1];
      reordered[1] = reordered[count - 1];
      reordered[count - 1] = tmp;
    }
    return {
      ids: reordered.map((origIdx) => p1Ids[origIdx]),
      canonicalIndices: reordered
    };
  }
  return { ids: [...p1Ids], canonicalIndices: indices };
}

function createInitialFastMoneyState(fastMoneyBank) {
  const defaultSet1 = fastMoneyBank.filter((q) => Number(q.set) === 1).slice(0, 5);
  const questionIds = (defaultSet1.length >= 5 ? defaultSet1 : fastMoneyBank.slice(0, 5)).map((q) => q.id);
  const p2Order = buildP2Order(questionIds, 'shuffled', fastMoneyBank, 2);

  return {
    phase: 'setup', // setup | p1 | p1_done | p2 | scoring | final
    config: {
      participatingTeam: 'teamA',
      player1Name: 'Player 1',
      player2Name: 'Player 2',
      targetScore: 200,
      questionsPerPlayer: 5,
      p1Duration: 20,
      p2Duration: 25,
      questionSet: 1,
      p2OrderMode: 'shuffled',
      p2AlternateSet: 2
    },
    activePlayer: 1,
    currentQuestionIndex: 0,
    timer: {
      duration: 20,
      remainingSeconds: 20,
      running: false,
      startedAt: null
    },
    questionIds,
    p2QuestionIds: p2Order.ids,
    p2CanonicalMap: p2Order.canonicalIndices,
    p1Submissions: [],
    p2Submissions: [],
    manualBonusPoints: 0,
    totals: {
      p1Score: 0,
      p2Score: 0,
      bonusPoints: 0,
      combinedScore: 0
    },
    result: null,
    celebrationNonce: 0
  };
}

function createRoom(options = {}) {
  const roomId = options.roomId || generateRoomCode();
  const edition = EDITION_META[options.edition] ? options.edition : 'classic';
  const editionBanks = getDefaultAllEditionBanks();
  const fastMoneyBank = getDefaultFastMoneyBank();

  const adminPin = options.adminPin
    ? String(options.adminPin).trim().slice(0, 16)
    : generatePin();
  let hostPin = options.hostPin
    ? String(options.hostPin).trim().slice(0, 16)
    : generatePin();
  if (hostPin === adminPin) hostPin = generatePin();

  return {
    schemaVersion: 2,
    roomId,
    adminToken: generateToken(24),
    adminPin,
    hostToken: generateToken(24),
    hostPin,
    locked: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
    view: 'home', // home | game | fastmoney | winner | studio
    edition,
    editionBanks,
    fastMoneyBank,
    teams: {
      teamA: {
        name: String(options.teamAName || 'TEAM A').trim().slice(0, 36) || 'TEAM A',
        playerName: String(options.teamAPlayer || 'Captain Holly').trim().slice(0, 36) || 'Captain Holly',
        score: 0,
        strikes: 0
      },
      teamB: {
        name: String(options.teamBName || 'TEAM B').trim().slice(0, 36) || 'TEAM B',
        playerName: String(options.teamBPlayer || 'Captain Noel').trim().slice(0, 36) || 'Captain Noel',
        score: 0,
        strikes: 0
      }
    },
    currentRoundIndex: 0,
    revealedSlots: [false, false, false, false, false, false, false, false],
    roundPoints: 0,
    roundPointsTransferred: false,
    transferredToTeam: null,
    transactions: [],
    settings: {
      maxStrikes: 3,
      quickPointsStep: 10,
      soundMusicEnabled: true,
      soundSfxEnabled: true,
      allowPlayerGuesses: true
    },
    winnerOverride: 'auto',
    celebrationNonce: 0,
    lastBuzz: null,
    strikeEvent: null,
    revealEvent: null,
    playerGuesses: [],
    fastMoney: createInitialFastMoneyState(fastMoneyBank),
    backups: [],
    participants: new Map(),
    clients: new Set()
  };
}

function touchRoom(room) {
  room.version += 1;
  room.updatedAt = Date.now();
}

function getCurrentRound(room) {
  const bank = room.editionBanks[room.edition] || [];
  if (!bank.length) return null;
  room.currentRoundIndex = Math.max(0, Math.min(room.currentRoundIndex, bank.length - 1));
  return bank[room.currentRoundIndex];
}

function resetRoundState(room) {
  room.revealedSlots = [false, false, false, false, false, false, false, false];
  room.roundPoints = 0;
  room.roundPointsTransferred = false;
  room.transferredToTeam = null;
  room.teams.teamA.strikes = 0;
  room.teams.teamB.strikes = 0;
  room.strikeEvent = null;
  room.revealEvent = null;
  room.lastBuzz = null;
  room.playerGuesses = [];
}

function hideStandardAnswers(room) {
  room.revealedSlots = [false, false, false, false, false, false, false, false];
  room.roundPoints = 0;
  room.revealEvent = null;
  touchRoom(room);
}

function switchEdition(room, edition) {
  if (!EDITION_META[edition]) {
    throw new Error(`Invalid edition "${edition}". Choose classic, deluxe, or ultimate.`);
  }
  if (!room.editionBanks[edition]) {
    throw new Error(`Question bank for edition "${edition}" is missing.`);
  }
  room.edition = edition;
  room.currentRoundIndex = 0;
  resetRoundState(room);
  touchRoom(room);
}

function setView(room, view) {
  const allowed = ['home', 'game', 'fastmoney', 'winner', 'studio'];
  if (!allowed.includes(view)) throw new Error(`Invalid view "${view}".`);
  room.view = view;
  if (view === 'winner') {
    room.celebrationNonce = (room.celebrationNonce || 0) + 1;
  }
  touchRoom(room);
}

function setRound(room, index) {
  const bank = room.editionBanks[room.edition] || [];
  if (!bank.length) throw new Error('Question bank is empty.');
  const target = Math.max(0, Math.min(Number(index) || 0, bank.length - 1));
  room.currentRoundIndex = target;
  resetRoundState(room);
  touchRoom(room);
}

function revealAnswer(room, slotIndex) {
  const round = getCurrentRound(room);
  if (!round) throw new Error('No active round.');
  const idx = Number(slotIndex);
  if (!Number.isInteger(idx) || idx < 0 || idx > 7) {
    throw new Error('Slot index must be between 0 and 7.');
  }
  if (room.revealedSlots[idx]) {
    return { alreadyRevealed: true, slot: idx };
  }
  room.revealedSlots[idx] = true;
  const ans = round.answers[idx];
  room.roundPoints = round.answers.reduce(
    (sum, a, i) => (room.revealedSlots[i] ? sum + Number(a.points) : sum),
    0
  );
  room.revealEvent = {
    slotIndex: idx,
    rank: idx + 1,
    text: ans.text,
    points: ans.points,
    type: 'single',
    at: Date.now()
  };
  touchRoom(room);
  return { alreadyRevealed: false, slot: idx, answer: ans };
}

function revealAllAnswers(room) {
  const round = getCurrentRound(room);
  if (!round) throw new Error('No active round.');
  const newlyRevealed = [];
  for (let i = 0; i < round.answers.length; i++) {
    if (!room.revealedSlots[i]) {
      room.revealedSlots[i] = true;
      newlyRevealed.push(i);
    }
  }
  room.roundPoints = round.answers.reduce((sum, a) => sum + Number(a.points), 0);
  room.revealEvent = {
    slots: newlyRevealed,
    type: 'all',
    at: Date.now()
  };
  touchRoom(room);
  return { newlyRevealed };
}

function transferRoundPoints(room, targetTeam) {
  if (targetTeam !== 'teamA' && targetTeam !== 'teamB') {
    throw new Error('Target team must be teamA or teamB.');
  }
  if (room.roundPointsTransferred) {
    const prevName = room.transferredToTeam ? room.teams[room.transferredToTeam].name : 'a team';
    throw new Error(
      `Duplicate transfer blocked: Round points were already awarded to ${prevName}. Use Undo Last Transaction or Reset Round first.`
    );
  }
  const pts = Number(room.roundPoints) || 0;
  if (pts <= 0) {
    throw new Error('No revealed round points available to transfer yet.');
  }
  const round = getCurrentRound(room);
  room.teams[targetTeam].score += pts;
  room.roundPointsTransferred = true;
  room.transferredToTeam = targetTeam;

  const tx = {
    id: `tx-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    timestamp: Date.now(),
    type: 'round_transfer',
    team: targetTeam,
    teamName: room.teams[targetTeam].name,
    delta: pts,
    roundNumber: room.currentRoundIndex + 1,
    roundId: round ? round.id : null,
    note: `Round ${room.currentRoundIndex + 1} bank transferred`,
    undone: false
  };
  room.transactions.push(tx);
  touchRoom(room);
  return tx;
}

function adjustTeamScore(room, targetTeam, operation, amount, note = '') {
  if (targetTeam !== 'teamA' && targetTeam !== 'teamB') {
    throw new Error('Target team must be teamA or teamB.');
  }
  const num = Number(amount);
  if (!Number.isFinite(num) || !Number.isInteger(num) || num <= 0 || num > 100000) {
    throw new Error('Points must be a positive integer (1 to 100000).');
  }
  if (operation !== 'add' && operation !== 'subtract') {
    throw new Error('Operation must be add or subtract.');
  }
  const delta = operation === 'add' ? num : -num;
  room.teams[targetTeam].score = Math.max(0, room.teams[targetTeam].score + delta);

  const tx = {
    id: `tx-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    timestamp: Date.now(),
    type: operation === 'add' ? 'manual_add' : 'manual_subtract',
    team: targetTeam,
    teamName: room.teams[targetTeam].name,
    delta,
    roundNumber: room.currentRoundIndex + 1,
    roundId: getCurrentRound(room)?.id || null,
    note: String(note || (operation === 'add' ? 'Manual points added' : 'Manual points subtracted')).slice(0, 100),
    undone: false
  };
  room.transactions.push(tx);
  touchRoom(room);
  return tx;
}

function undoLastTransfer(room) {
  for (let i = room.transactions.length - 1; i >= 0; i--) {
    const tx = room.transactions[i];
    if (!tx.undone) {
      tx.undone = true;
      tx.undoneAt = Date.now();
      room.teams[tx.team].score = Math.max(0, room.teams[tx.team].score - tx.delta);
      const currentRound = getCurrentRound(room);
      if (
        tx.type === 'round_transfer' &&
        currentRound &&
        tx.roundId === currentRound.id &&
        room.roundPointsTransferred
      ) {
        room.roundPointsTransferred = false;
        room.transferredToTeam = null;
      }
      touchRoom(room);
      return tx;
    }
  }
  throw new Error('No transaction available to undo.');
}

function addStrike(room, targetTeam) {
  if (targetTeam !== 'teamA' && targetTeam !== 'teamB') {
    throw new Error('Team must be teamA or teamB.');
  }
  const maxS = Math.max(1, Number(room.settings.maxStrikes) || 3);
  const next = Math.min(maxS, room.teams[targetTeam].strikes + 1);
  room.teams[targetTeam].strikes = next;
  room.strikeEvent = {
    team: targetTeam,
    teamName: room.teams[targetTeam].name,
    count: next,
    maxStrikes: maxS,
    isMax: next >= maxS,
    at: Date.now()
  };
  touchRoom(room);
  return room.strikeEvent;
}

function resetStrikes(room, target = 'both') {
  if (target === 'teamA' || target === 'both') room.teams.teamA.strikes = 0;
  if (target === 'teamB' || target === 'both') room.teams.teamB.strikes = 0;
  room.strikeEvent = null;
  touchRoom(room);
}

function updateTeamInfo(room, targetTeam, { name, playerName }) {
  if (targetTeam !== 'teamA' && targetTeam !== 'teamB') {
    throw new Error('Team must be teamA or teamB.');
  }
  if (typeof name === 'string' && name.trim()) {
    room.teams[targetTeam].name = name.trim().slice(0, 36);
  }
  if (typeof playerName === 'string') {
    room.teams[targetTeam].playerName = playerName.trim().slice(0, 36);
  }
  touchRoom(room);
}

function setWinnerMode(room, mode) {
  const allowed = ['auto', 'teamA', 'teamB', 'tie'];
  if (!allowed.includes(mode)) throw new Error('Invalid winner mode.');
  room.winnerOverride = mode;
  room.celebrationNonce = (room.celebrationNonce || 0) + 1;
  room.view = 'winner';
  touchRoom(room);
}

function replayWinnerCelebration(room) {
  room.celebrationNonce = (room.celebrationNonce || 0) + 1;
  touchRoom(room);
}

function startNewGame(room) {
  room.teams.teamA.score = 0;
  room.teams.teamA.strikes = 0;
  room.teams.teamB.score = 0;
  room.teams.teamB.strikes = 0;
  room.currentRoundIndex = 0;
  room.transactions = [];
  room.winnerOverride = 'auto';
  resetRoundState(room);
  room.fastMoney = createInitialFastMoneyState(room.fastMoneyBank);
  room.view = 'game';
  touchRoom(room);
}

// =============================================================================
// FAST MONEY WORKFLOW — STRICT PRIVACY, ZERO LIVE ANSWER REVEAL, ZERO AUTO-MATCH
// =============================================================================

function configureFastMoney(room, cfg = {}) {
  const fm = room.fastMoney;
  const c = fm.config;
  if (cfg.participatingTeam === 'teamA' || cfg.participatingTeam === 'teamB') {
    c.participatingTeam = cfg.participatingTeam;
  }
  if (typeof cfg.player1Name === 'string' && cfg.player1Name.trim()) {
    c.player1Name = cfg.player1Name.trim().slice(0, 32);
  }
  if (typeof cfg.player2Name === 'string' && cfg.player2Name.trim()) {
    c.player2Name = cfg.player2Name.trim().slice(0, 32);
  }
  if (cfg.targetScore !== undefined) {
    c.targetScore = Math.max(50, Math.min(500, Math.round(Number(cfg.targetScore) || 200)));
  }
  if (cfg.questionsPerPlayer !== undefined) {
    c.questionsPerPlayer = Math.max(3, Math.min(10, Math.round(Number(cfg.questionsPerPlayer) || 5)));
  }
  if (cfg.p1Duration !== undefined) {
    c.p1Duration = Math.max(5, Math.min(120, Math.round(Number(cfg.p1Duration) || 20)));
  }
  if (cfg.p2Duration !== undefined) {
    c.p2Duration = Math.max(5, Math.min(120, Math.round(Number(cfg.p2Duration) || 25)));
  }
  if (cfg.questionSet !== undefined) {
    c.questionSet = Math.max(1, Math.min(6, Math.round(Number(cfg.questionSet) || 1)));
  }
  if (['shuffled', 'same', 'alternate_set'].includes(cfg.p2OrderMode)) {
    c.p2OrderMode = cfg.p2OrderMode;
  }
  if (cfg.p2AlternateSet !== undefined) {
    c.p2AlternateSet = Math.max(1, Math.min(6, Math.round(Number(cfg.p2AlternateSet) || 2)));
  }

  const bank = room.fastMoneyBank;
  const setQs = bank.filter((q) => Number(q.set) === Number(c.questionSet));
  const pool = [...setQs, ...bank.filter((q) => Number(q.set) !== Number(c.questionSet))];
  const chosen = pool.slice(0, c.questionsPerPlayer);
  fm.questionIds = chosen.map((q) => q.id);

  const p2Order = buildP2Order(fm.questionIds, c.p2OrderMode, bank, c.p2AlternateSet);
  fm.p2QuestionIds = p2Order.ids;
  fm.p2CanonicalMap = p2Order.canonicalIndices;
  fm.timer = {
    duration: c.p1Duration,
    remainingSeconds: c.p1Duration,
    running: false,
    startedAt: null
  };
  touchRoom(room);
}

function startFastMoneyRound(room, cfg = null) {
  if (cfg) configureFastMoney(room, cfg);
  const fm = room.fastMoney;
  const bankMap = new Map(room.fastMoneyBank.map((q) => [q.id, q]));

  fm.phase = 'p1';
  fm.activePlayer = 1;
  fm.currentQuestionIndex = 0;
  fm.manualBonusPoints = 0;
  fm.p1Submissions = fm.questionIds.map((qId, idx) => ({
    index: idx,
    canonicalIndex: idx,
    questionId: qId,
    questionText: bankMap.get(qId)?.question || '',
    answerText: '',
    locked: false,
    skipped: false,
    manualPoints: 0
  }));
  fm.p2Submissions = fm.p2QuestionIds.map((qId, idx) => ({
    index: idx,
    canonicalIndex: fm.p2CanonicalMap[idx],
    questionId: qId,
    questionText: bankMap.get(qId)?.question || '',
    answerText: '',
    locked: false,
    skipped: false,
    manualPoints: 0
  }));
  fm.totals = { p1Score: 0, p2Score: 0, bonusPoints: 0, combinedScore: 0 };
  fm.result = null;
  fm.timer = {
    duration: fm.config.p1Duration,
    remainingSeconds: fm.config.p1Duration,
    running: true,
    startedAt: Date.now()
  };
  room.view = 'fastmoney';
  touchRoom(room);
}

function advanceFastMoneySlot(room, playerNum) {
  const fm = room.fastMoney;
  const subs = playerNum === 1 ? fm.p1Submissions : fm.p2Submissions;
  const nextUnlocked = subs.findIndex((s) => !s.locked);
  if (nextUnlocked === -1) {
    const live = computeLiveTimer(fm.timer);
    fm.timer.remainingSeconds = live.remainingSeconds;
    fm.timer.running = false;
    fm.timer.startedAt = null;
    if (playerNum === 1) {
      fm.phase = 'p1_done';
    } else {
      fm.phase = 'scoring';
      recalculateManualFastMoneyTotals(room);
    }
  } else {
    fm.currentQuestionIndex = nextUnlocked;
  }
  return nextUnlocked;
}

/**
 * Pure submission capture — saves typed answer privately with ZERO matching or automatic points!
 */
function submitFastMoneyAnswer(room, playerNum, answerText, questionIndex = null) {
  const fm = room.fastMoney;
  const expectedPhase = playerNum === 1 ? 'p1' : 'p2';
  if (fm.phase !== expectedPhase) {
    throw new Error(`Player ${playerNum} cannot submit during phase "${fm.phase}".`);
  }
  const subs = playerNum === 1 ? fm.p1Submissions : fm.p2Submissions;
  const idx = questionIndex !== null && questionIndex !== undefined ? Number(questionIndex) : fm.currentQuestionIndex;
  if (!Number.isInteger(idx) || idx < 0 || idx >= subs.length) {
    throw new Error('Invalid Fast Money question index.');
  }
  const slot = subs[idx];
  if (slot.locked) throw new Error('This question response is already locked.');

  slot.answerText = String(answerText || '').trim().slice(0, 100);
  slot.locked = true;
  slot.skipped = false;
  slot.submittedAt = Date.now();
  slot.manualPoints = 0; // Always 0 until host manually enters points after both players finish

  const nextIndex = advanceFastMoneySlot(room, playerNum);
  touchRoom(room);
  return { locked: true, nextIndex, phase: fm.phase };
}

function skipFastMoneyQuestion(room, playerNum = null) {
  const fm = room.fastMoney;
  const activeNum = playerNum || (fm.phase === 'p2' ? 2 : 1);
  const expectedPhase = activeNum === 1 ? 'p1' : 'p2';
  if (fm.phase !== expectedPhase) {
    throw new Error('Can only skip a question during an active Fast Money turn.');
  }
  const subs = activeNum === 1 ? fm.p1Submissions : fm.p2Submissions;
  const slot = subs[fm.currentQuestionIndex];
  if (slot && !slot.locked) {
    slot.answerText = '';
    slot.locked = true;
    slot.skipped = true;
    slot.submittedAt = Date.now();
    slot.manualPoints = 0;
  }
  advanceFastMoneySlot(room, activeNum);
  touchRoom(room);
}

function lockFastMoneyPlayerTurn(room, playerNum) {
  const fm = room.fastMoney;
  const subs = playerNum === 1 ? fm.p1Submissions : fm.p2Submissions;
  subs.forEach((s) => {
    if (!s.locked) {
      s.locked = true;
      s.skipped = !s.answerText;
      s.manualPoints = 0;
    }
  });
  const live = computeLiveTimer(fm.timer);
  fm.timer.remainingSeconds = live.remainingSeconds;
  fm.timer.running = false;
  fm.timer.startedAt = null;
  if (playerNum === 1) {
    fm.phase = 'p1_done';
  } else {
    fm.phase = 'scoring';
    recalculateManualFastMoneyTotals(room);
  }
  touchRoom(room);
}

function startFastMoneyPlayer2(room) {
  const fm = room.fastMoney;
  if (fm.phase !== 'p1_done' && fm.phase !== 'p1') {
    throw new Error('Player 2 can only start after Player 1 completes.');
  }
  fm.p1Submissions.forEach((s) => { s.locked = true; });
  fm.phase = 'p2';
  fm.activePlayer = 2;
  fm.currentQuestionIndex = 0;
  fm.timer = {
    duration: fm.config.p2Duration,
    remainingSeconds: fm.config.p2Duration,
    running: true,
    startedAt: Date.now()
  };
  touchRoom(room);
}

function adjustFastMoneyTimer(room, action, seconds = 0) {
  const fm = room.fastMoney;
  const live = computeLiveTimer(fm.timer);
  if (action === 'pause') {
    fm.timer.remainingSeconds = live.remainingSeconds;
    fm.timer.running = false;
    fm.timer.startedAt = null;
  } else if (action === 'resume' || action === 'start') {
    fm.timer.remainingSeconds = live.remainingSeconds > 0 ? live.remainingSeconds : fm.timer.duration;
    fm.timer.running = true;
    fm.timer.startedAt = Date.now();
  } else if (action === 'add') {
    const addSec = Number(seconds) || 0;
    fm.timer.remainingSeconds = Math.max(0, Math.min(300, live.remainingSeconds + addSec));
    if (fm.timer.running) fm.timer.startedAt = Date.now();
  } else if (action === 'set') {
    const val = Math.max(0, Math.min(300, Number(seconds) || 0));
    fm.timer.remainingSeconds = val;
    fm.timer.duration = Math.max(val, 5);
    if (fm.timer.running) fm.timer.startedAt = Date.now();
  } else if (action === 'reset') {
    const dur = fm.activePlayer === 2 ? fm.config.p2Duration : fm.config.p1Duration;
    fm.timer.duration = dur;
    fm.timer.remainingSeconds = dur;
    fm.timer.running = false;
    fm.timer.startedAt = null;
  } else {
    throw new Error('Unknown timer action.');
  }
  touchRoom(room);
}

function recalculateManualFastMoneyTotals(room) {
  const fm = room.fastMoney;
  const p1 = fm.p1Submissions.reduce((sum, s) => sum + (Number(s.manualPoints) || 0), 0);
  const p2 = fm.p2Submissions.reduce((sum, s) => sum + (Number(s.manualPoints) || 0), 0);
  const bonus = Number(fm.manualBonusPoints) || 0;
  const combined = p1 + p2 + bonus;
  fm.totals = {
    p1Score: p1,
    p2Score: p2,
    bonusPoints: bonus,
    combinedScore: combined
  };
  fm.result = {
    won: combined >= fm.config.targetScore,
    targetScore: fm.config.targetScore,
    combinedScore: combined,
    p1Score: p1,
    p2Score: p2,
    bonusPoints: bonus
  };
}

function updateFastMoneyManualScore(room, { playerNum, canonicalIndex, points, answerText }) {
  const fm = room.fastMoney;
  if (fm.phase !== 'scoring' && fm.phase !== 'final') {
    throw new Error('Manual scoring is only available after both players finish.');
  }
  const subs = Number(playerNum) === 2 ? fm.p2Submissions : fm.p1Submissions;
  const slot = subs.find((s) => s.canonicalIndex === Number(canonicalIndex));
  if (!slot) throw new Error('Submission slot not found.');

  if (points !== undefined) {
    const val = Math.max(0, Math.min(100, Math.round(Number(points) || 0)));
    slot.manualPoints = val;
  }
  if (typeof answerText === 'string') {
    slot.answerText = answerText.trim().slice(0, 100);
    if (slot.answerText) slot.skipped = false;
  }
  recalculateManualFastMoneyTotals(room);
  touchRoom(room);
}

function setFastMoneyManualBonus(room, bonusPoints) {
  const fm = room.fastMoney;
  if (fm.phase !== 'scoring' && fm.phase !== 'final') {
    throw new Error('Manual bonus can only be set during scoring.');
  }
  fm.manualBonusPoints = Math.max(0, Math.min(500, Math.round(Number(bonusPoints) || 0)));
  recalculateManualFastMoneyTotals(room);
  touchRoom(room);
}

function publishFastMoneyResult(room) {
  const fm = room.fastMoney;
  if (fm.phase !== 'scoring' && fm.phase !== 'final') {
    throw new Error('Both players must finish before publishing the Fast Money result.');
  }
  recalculateManualFastMoneyTotals(room);
  fm.phase = 'final';
  fm.celebrationNonce = (fm.celebrationNonce || 0) + 1;
  touchRoom(room);
}

function resetFastMoneyToSetup(room) {
  const prevCfg = deepClone(room.fastMoney.config);
  room.fastMoney = createInitialFastMoneyState(room.fastMoneyBank);
  configureFastMoney(room, prevCfg);
  room.fastMoney.phase = 'setup';
  touchRoom(room);
}

// =============================================================================
// ADMINISTRATOR-ONLY GAME STUDIO CRUD + BACKUP / IMPORT / EXPORT
// =============================================================================

function studioSaveStandardRound(room, edition, index, roundData) {
  if (!EDITION_META[edition]) throw new Error('Invalid edition.');
  const validation = validateStandardRound(roundData);
  if (!validation.valid) throw new Error(validation.errors.join(' '));
  const bank = room.editionBanks[edition];
  const clean = {
    id: roundData.id || `custom-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
    category: String(roundData.category || CHRISTMAS_CATEGORIES[0]).trim().slice(0, 64),
    question: roundData.question.trim().slice(0, 220),
    answers: roundData.answers.map((a) => ({
      text: a.text.trim().slice(0, 80),
      points: Number(a.points)
    }))
  };
  if (index === null || index === undefined || index < 0 || index >= bank.length) {
    bank.push(clean);
  } else {
    bank[index] = clean;
  }
  touchRoom(room);
  return clean;
}

function studioDeleteStandardRound(room, edition, index) {
  if (!EDITION_META[edition]) throw new Error('Invalid edition.');
  const bank = room.editionBanks[edition];
  if (bank.length <= 1) throw new Error('Cannot delete the last remaining round.');
  if (index < 0 || index >= bank.length) throw new Error('Round index out of range.');
  bank.splice(index, 1);
  if (room.edition === edition && room.currentRoundIndex >= bank.length) {
    room.currentRoundIndex = bank.length - 1;
    resetRoundState(room);
  }
  touchRoom(room);
}

function studioDuplicateStandardRound(room, edition, index) {
  if (!EDITION_META[edition]) throw new Error('Invalid edition.');
  const bank = room.editionBanks[edition];
  if (index < 0 || index >= bank.length) throw new Error('Round index out of range.');
  const copy = deepClone(bank[index]);
  copy.id = `dup-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
  copy.question = `${copy.question} (Copy)`;
  bank.splice(index + 1, 0, copy);
  touchRoom(room);
  return copy;
}

function studioReorderStandardRound(room, edition, fromIndex, toIndex) {
  if (!EDITION_META[edition]) throw new Error('Invalid edition.');
  const bank = room.editionBanks[edition];
  if (fromIndex < 0 || fromIndex >= bank.length || toIndex < 0 || toIndex >= bank.length) {
    throw new Error('Invalid reorder indices.');
  }
  const [item] = bank.splice(fromIndex, 1);
  bank.splice(toIndex, 0, item);
  touchRoom(room);
}

// Fast Money Question Editor CRUD (Add, Edit, Delete, Duplicate, Reorder, Notes, Category)
function studioSaveFastMoneyQuestion(room, index, qData) {
  const v = validateFastMoneyQuestion(qData);
  if (!v.valid) throw new Error(v.errors.join(' '));
  const clean = {
    id: qData.id || `fm-custom-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
    set: Math.max(1, Math.min(6, Number(qData.set) || 1)),
    category: String(qData.category || CHRISTMAS_CATEGORIES[0]).trim().slice(0, 64),
    question: qData.question.trim().slice(0, 220),
    acceptedAnswers: qData.acceptedAnswers.map((a) => ({
      text: a.text.trim().slice(0, 80),
      points: Number(a.points)
    })),
    notes: String(qData.notes || '').trim().slice(0, 500)
  };
  if (index === null || index === undefined || index < 0 || index >= room.fastMoneyBank.length) {
    room.fastMoneyBank.push(clean);
  } else {
    room.fastMoneyBank[index] = clean;
  }
  touchRoom(room);
  return clean;
}

function studioDeleteFastMoneyQuestion(room, index) {
  if (room.fastMoneyBank.length <= 5) {
    throw new Error('Keep at least 5 Fast Money questions in the bank.');
  }
  if (index < 0 || index >= room.fastMoneyBank.length) {
    throw new Error('Fast Money question index out of range.');
  }
  room.fastMoneyBank.splice(index, 1);
  touchRoom(room);
}

function studioDuplicateFastMoneyQuestion(room, index) {
  if (index < 0 || index >= room.fastMoneyBank.length) {
    throw new Error('Fast Money question index out of range.');
  }
  const copy = deepClone(room.fastMoneyBank[index]);
  copy.id = `fm-dup-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
  copy.question = `${copy.question} (Copy)`;
  room.fastMoneyBank.splice(index + 1, 0, copy);
  touchRoom(room);
  return copy;
}

function studioReorderFastMoneyQuestion(room, fromIndex, toIndex) {
  const bank = room.fastMoneyBank;
  if (fromIndex < 0 || fromIndex >= bank.length || toIndex < 0 || toIndex >= bank.length) {
    throw new Error('Invalid Fast Money reorder indices.');
  }
  const [item] = bank.splice(fromIndex, 1);
  bank.splice(toIndex, 0, item);
  touchRoom(room);
}

function exportStudioBundle(room) {
  return {
    product: 'CHRISTMAS FEUD - THE ULTIMATE CHRISTMAS GAME SHOW',
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    edition: room.edition,
    teams: deepClone(room.teams),
    settings: deepClone(room.settings),
    fastMoneyConfig: deepClone(room.fastMoney.config),
    editionBanks: deepClone(room.editionBanks),
    fastMoneyBank: deepClone(room.fastMoneyBank)
  };
}

function createStudioBackup(room, label = '') {
  const snapshot = {
    id: `bkp-${Date.now()}`,
    createdAt: Date.now(),
    label: String(label || `Backup ${new Date().toLocaleTimeString()}`).slice(0, 60),
    bundle: exportStudioBundle(room)
  };
  room.backups.unshift(snapshot);
  if (room.backups.length > 10) room.backups.pop();
  touchRoom(room);
  return { id: snapshot.id, createdAt: snapshot.createdAt, label: snapshot.label };
}

function importStudioBundle(room, bundle) {
  if (!bundle || typeof bundle !== 'object' || !bundle.editionBanks) {
    throw new Error('Invalid JSON import payload (missing editionBanks).');
  }
  const validatedEditions = {};
  for (const ed of ['classic', 'deluxe', 'ultimate']) {
    if (Array.isArray(bundle.editionBanks[ed]) && bundle.editionBanks[ed].length > 0) {
      bundle.editionBanks[ed].forEach((r, idx) => {
        const v = validateStandardRound(r);
        if (!v.valid) throw new Error(`Invalid ${ed} round #${idx + 1}: ${v.errors.join(' ')}`);
      });
      validatedEditions[ed] = deepClone(bundle.editionBanks[ed]);
    }
  }
  if (!Object.keys(validatedEditions).length) {
    throw new Error('No valid edition question banks found in import file.');
  }

  let validatedFM = null;
  if (Array.isArray(bundle.fastMoneyBank) && bundle.fastMoneyBank.length >= 5) {
    bundle.fastMoneyBank.forEach((q, idx) => {
      const v = validateFastMoneyQuestion(q);
      if (!v.valid) throw new Error(`Invalid Fast Money question #${idx + 1}: ${v.errors.join(' ')}`);
    });
    validatedFM = deepClone(bundle.fastMoneyBank).map((q) => ({
      ...q,
      category: q.category || CHRISTMAS_CATEGORIES[0],
      notes: q.notes || ''
    }));
  }

  createStudioBackup(room, 'Auto-backup before import');

  for (const [ed, rounds] of Object.entries(validatedEditions)) {
    room.editionBanks[ed] = rounds;
  }
  if (validatedFM) room.fastMoneyBank = validatedFM;
  if (bundle.edition && EDITION_META[bundle.edition]) room.edition = bundle.edition;
  if (bundle.teams?.teamA) {
    room.teams.teamA.name = String(bundle.teams.teamA.name || room.teams.teamA.name).slice(0, 36);
    room.teams.teamA.playerName = String(bundle.teams.teamA.playerName || room.teams.teamA.playerName).slice(0, 36);
  }
  if (bundle.teams?.teamB) {
    room.teams.teamB.name = String(bundle.teams.teamB.name || room.teams.teamB.name).slice(0, 36);
    room.teams.teamB.playerName = String(bundle.teams.teamB.playerName || room.teams.teamB.playerName).slice(0, 36);
  }
  if (bundle.settings) {
    if (bundle.settings.maxStrikes) room.settings.maxStrikes = Math.max(1, Math.min(5, Number(bundle.settings.maxStrikes)));
    if (bundle.settings.quickPointsStep) room.settings.quickPointsStep = Math.max(1, Math.min(100, Number(bundle.settings.quickPointsStep)));
  }
  if (bundle.fastMoneyConfig) configureFastMoney(room, bundle.fastMoneyConfig);
  room.currentRoundIndex = 0;
  resetRoundState(room);
  touchRoom(room);
}

function loadAllChristmasDefaultBanks(room) {
  createStudioBackup(room, 'Auto-backup before loading All-Christmas defaults');
  room.editionBanks = getDefaultAllEditionBanks();
  room.fastMoneyBank = getDefaultFastMoneyBank();
  room.currentRoundIndex = 0;
  resetRoundState(room);
  room.fastMoney = createInitialFastMoneyState(room.fastMoneyBank);
  touchRoom(room);
}

function restoreStudioBackup(room, backupId) {
  const found = room.backups.find((b) => b.id === backupId);
  if (!found) throw new Error('Backup not found.');
  importStudioBundle(room, found.bundle);
}

module.exports = {
  generateRoomCode,
  generateToken,
  createRoom,
  touchRoom,
  resetRoundState,
  hideStandardAnswers,
  switchEdition,
  setView,
  setRound,
  revealAnswer,
  revealAllAnswers,
  transferRoundPoints,
  adjustTeamScore,
  undoLastTransfer,
  addStrike,
  resetStrikes,
  updateTeamInfo,
  setWinnerMode,
  replayWinnerCelebration,
  startNewGame,
  configureFastMoney,
  startFastMoneyRound,
  submitFastMoneyAnswer,
  skipFastMoneyQuestion,
  lockFastMoneyPlayerTurn,
  startFastMoneyPlayer2,
  adjustFastMoneyTimer,
  updateFastMoneyManualScore,
  setFastMoneyManualBonus,
  publishFastMoneyResult,
  resetFastMoneyToSetup,
  studioSaveStandardRound,
  studioDeleteStandardRound,
  studioDuplicateStandardRound,
  studioReorderStandardRound,
  studioSaveFastMoneyQuestion,
  studioDeleteFastMoneyQuestion,
  studioDuplicateFastMoneyQuestion,
  studioReorderFastMoneyQuestion,
  exportStudioBundle,
  createStudioBackup,
  importStudioBundle,
  loadAllChristmasDefaultBanks,
  restoreStudioBackup
};
