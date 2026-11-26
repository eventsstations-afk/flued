/**
 * CHRISTMAS FEUD — STRICT SERVER-SIDE 4-ROLE PRIVACY & ACCESS CONTROL
 * Enforces four distinct roles on the backend:
 *   1. admin    — Full Administrator access: Game Studio CRUD, Private Fast Money Editor,
 *                 Administrator-Only Answer-Key PDF Exports, plus all Host controls
 *   2. host     — Live Game Show Host: Standard FEUD reveals, scores, strikes, transfers,
 *                 Fast Money timer & manual scoring summary (NO Admin Studio/PDF export)
 *   3. player   — Contestant (Team A / Team B): Current question, revealed standard slots only,
 *                 Buzz-In, Fast Money own-turn submission (ZERO answer keys, ZERO P1 answers during P2)
 *   4. audience — Public Display / TV: Revealed standard answers, scores, strikes, timer,
 *                 and published Fast Money final scores only (ZERO answer keys!)
 *
 * CRITICAL FAST MONEY PRIVACY POLICY:
 * - Live Fast Money state NEVER contains acceptedAnswers, answer keys, synonyms, or admin notes
 *   for ANY role (even admin/host in live play). Keys exist ONLY in Admin Studio & Admin PDFs!
 */

const crypto = require('crypto');
const { EDITION_META, CHRISTMAS_CATEGORIES, GAME_DATA_DISCLAIMER } = require('./data');

function timingSafeEqualStr(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function isValidAdminRequest(room, req, urlObj) {
  if (!room || !room.adminToken) return false;
  const headerToken = req.headers['x-admin-token'];
  if (headerToken && timingSafeEqualStr(String(headerToken), room.adminToken)) return true;
  if (urlObj) {
    const qToken = urlObj.searchParams.get('adminToken');
    if (qToken && timingSafeEqualStr(String(qToken), room.adminToken)) return true;
  }
  const cTok = getCookie(req, 'cff_admin_token');
  if (cTok && timingSafeEqualStr(cTok, room.adminToken)) return true;
  return false;
}

function isValidHostRequest(room, req, urlObj) {
  if (!room) return false;
  if (isValidAdminRequest(room, req, urlObj)) return true;
  const headerToken = req.headers['x-host-token'];
  if (headerToken && timingSafeEqualStr(String(headerToken), room.hostToken)) return true;
  if (urlObj) {
    const qToken = urlObj.searchParams.get('hostToken');
    if (qToken && timingSafeEqualStr(String(qToken), room.hostToken)) return true;
  }
  const cTok = getCookie(req, 'cff_host_token');
  if (cTok && timingSafeEqualStr(cTok, room.hostToken)) return true;
  return false;
}

function getParticipantFromRequest(room, req, urlObj) {
  const pid =
    req.headers['x-participant-id'] ||
    (urlObj ? urlObj.searchParams.get('participantId') : null);
  const ptok =
    req.headers['x-participant-token'] ||
    (urlObj ? urlObj.searchParams.get('participantToken') : null);
  if (!pid) return null;
  const p = room.participants.get(String(pid));
  if (!p || p.kicked) return null;
  if (ptok && !timingSafeEqualStr(String(ptok), p.token)) return null;
  return p;
}

function resolveRequestRole(room, req, urlObj) {
  if (isValidAdminRequest(room, req, urlObj)) return { role: 'admin', participant: null };
  if (isValidHostRequest(room, req, urlObj)) return { role: 'host', participant: null };
  const participant = getParticipantFromRequest(room, req, urlObj);
  if (participant) return { role: participant.role, participant };
  return { role: 'audience', participant: null };
}

function computeLiveTimer(timer) {
  if (!timer) {
    return { remainingSeconds: 0, displaySeconds: 0, running: false, duration: 20, serverNow: Date.now() };
  }
  const now = Date.now();
  let remaining = Number(timer.remainingSeconds) || 0;
  if (timer.running && timer.startedAt) {
    const elapsed = (now - timer.startedAt) / 1000;
    remaining = Math.max(0, remaining - elapsed);
  }
  return {
    remainingSeconds: Math.round(remaining * 10) / 10,
    displaySeconds: Math.ceil(remaining),
    running: Boolean(timer.running && remaining > 0),
    duration: Number(timer.duration) || 20,
    serverNow: now
  };
}

function buildPublicParticipants(room) {
  const list = [];
  for (const p of room.participants.values()) {
    if (p.kicked) continue;
    list.push({
      id: p.id,
      name: p.name,
      team: p.team,
      role: p.role,
      connected: Boolean(p.connected),
      joinedAt: p.joinedAt,
      lastSeenAt: p.lastSeenAt
    });
  }
  return list;
}

function buildWinnerSummary(room) {
  const a = room.teams.teamA.score;
  const b = room.teams.teamB.score;
  let winner = 'tie';
  if (room.winnerOverride === 'teamA') winner = 'teamA';
  else if (room.winnerOverride === 'teamB') winner = 'teamB';
  else if (room.winnerOverride === 'tie') winner = 'tie';
  else if (a > b) winner = 'teamA';
  else if (b > a) winner = 'teamB';

  return {
    winner,
    mode: room.winnerOverride || 'auto',
    teamAScore: a,
    teamBScore: b,
    teamAName: room.teams.teamA.name,
    teamBName: room.teams.teamB.name,
    pointDifference: Math.abs(a - b),
    celebrationNonce: room.celebrationNonce || 0
  };
}

/**
 * STRICT FAST MONEY PROJECTION — ZERO LIVE ANSWER KEYS, ZERO AUTO-MATCHING!
 * - NEVER includes acceptedAnswers, answer-key point values, synonyms, or admin notes.
 * - During p1 / p1_done / p2: Player 1's submitted texts are NEVER sent to Player 2 or Audience.
 * - During scoring: ONLY Host / Admin sees the private manual scoring table (submitted texts + manual score inputs).
 * - During final: Publishes Player 1 Total, Player 2 Total, Manual Bonus, Combined Score, Target Score & Result.
 */
function projectFastMoney(room, role) {
  const fm = room.fastMoney;
  const liveTimer = computeLiveTimer(fm.timer);
  const qCount = fm.questionIds.length;
  const fmBankMap = new Map(room.fastMoneyBank.map((q) => [q.id, q]));
  const isHostOrAdmin = role === 'admin' || role === 'host';

  const baseConfig = {
    participatingTeam: fm.config.participatingTeam,
    player1Name: fm.config.player1Name,
    player2Name: fm.config.player2Name,
    targetScore: fm.config.targetScore,
    questionsPerPlayer: fm.config.questionsPerPlayer,
    p1Duration: fm.config.p1Duration,
    p2Duration: fm.config.p2Duration,
    questionSet: fm.config.questionSet,
    p2OrderMode: fm.config.p2OrderMode,
    p2AlternateSet: fm.config.p2AlternateSet
  };

  const projection = {
    phase: fm.phase, // setup | p1 | p1_done | p2 | scoring | final
    config: baseConfig,
    activePlayer: fm.activePlayer,
    currentQuestionIndex: fm.currentQuestionIndex,
    totalQuestions: qCount,
    timer: liveTimer,
    p1SubmittedCount: fm.p1Submissions.filter((s) => s && s.locked).length,
    p2SubmittedCount: fm.p2Submissions.filter((s) => s && s.locked).length,
    currentPrompt: null,
    currentCategory: null,
    playerProgress: [],
    celebrationNonce: fm.celebrationNonce || 0
  };

  if (fm.phase === 'p1') {
    const qId = fm.questionIds[fm.currentQuestionIndex];
    const qObj = fmBankMap.get(qId);
    projection.currentPrompt = qObj ? qObj.question : null;
    projection.currentCategory = qObj ? qObj.category : null;
    projection.playerProgress = fm.p1Submissions.map((s, idx) => ({
      index: idx,
      locked: Boolean(s && s.locked),
      skipped: Boolean(s && s.skipped)
    }));
  } else if (fm.phase === 'p2') {
    // Player 1's answers remain COMPLETELY omitted!
    const qId = fm.p2QuestionIds[fm.currentQuestionIndex];
    const qObj = fmBankMap.get(qId);
    projection.currentPrompt = qObj ? qObj.question : null;
    projection.currentCategory = qObj ? qObj.category : null;
    projection.playerProgress = fm.p2Submissions.map((s, idx) => ({
      index: idx,
      locked: Boolean(s && s.locked),
      skipped: Boolean(s && s.skipped)
    }));
  } else if (fm.phase === 'scoring') {
    if (isHostOrAdmin) {
      // Private Host Manual Scoring Summary — NO answer keys included!
      projection.hostScoringRows = fm.questionIds.map((qId, idx) => {
        const qObj = fmBankMap.get(qId);
        const p1 = fm.p1Submissions[idx] || {};
        const p2 = fm.p2Submissions.find((s) => s.canonicalIndex === idx) || fm.p2Submissions[idx] || {};
        return {
          canonicalIndex: idx,
          questionNumber: idx + 1,
          questionText: qObj ? qObj.question : (p1.questionText || ''),
          p2QuestionText: p2.questionText && p2.questionText !== (qObj ? qObj.question : '') ? p2.questionText : null,
          category: qObj ? qObj.category : '',
          p1Answer: p1.answerText || '',
          p1Skipped: Boolean(p1.skipped),
          p1Points: Number(p1.manualPoints) || 0,
          p2Answer: p2.answerText || '',
          p2Skipped: Boolean(p2.skipped),
          p2Points: Number(p2.manualPoints) || 0
        };
      });
      projection.manualBonusPoints = Number(fm.manualBonusPoints) || 0;
      projection.totals = { ...fm.totals };
    }
    // Non-hosts see ONLY locked waiting state (neither P1 nor P2 texts or partial scores!)
  } else if (fm.phase === 'final') {
    projection.totals = { ...fm.totals };
    projection.manualBonusPoints = Number(fm.manualBonusPoints) || 0;
    projection.result = fm.result ? { ...fm.result } : null;
    if (isHostOrAdmin) {
      projection.hostScoringRows = fm.questionIds.map((qId, idx) => {
        const qObj = fmBankMap.get(qId);
        const p1 = fm.p1Submissions[idx] || {};
        const p2 = fm.p2Submissions.find((s) => s.canonicalIndex === idx) || fm.p2Submissions[idx] || {};
        return {
          canonicalIndex: idx,
          questionNumber: idx + 1,
          questionText: qObj ? qObj.question : (p1.questionText || ''),
          category: qObj ? qObj.category : '',
          p1Answer: p1.answerText || '',
          p1Skipped: Boolean(p1.skipped),
          p1Points: Number(p1.manualPoints) || 0,
          p2Answer: p2.answerText || '',
          p2Skipped: Boolean(p2.skipped),
          p2Points: Number(p2.manualPoints) || 0
        };
      });
    }
  }

  return projection;
}

/**
 * Primary server-side role projection.
 */
function projectRoomForRole(room, role = 'audience', participant = null) {
  const isHostOrAdmin = role === 'admin' || role === 'host';
  const isAdmin = role === 'admin';
  const bank = room.editionBanks[room.edition] || [];
  const safeIdx = Math.max(0, Math.min(room.currentRoundIndex, Math.max(0, bank.length - 1)));
  const round = bank[safeIdx] || null;

  const publicSlots = round
    ? round.answers.map((ans, idx) => {
        const revealed = Boolean(room.revealedSlots[idx]);
        return {
          rank: idx + 1,
          revealed,
          text: revealed ? ans.text : null,
          points: revealed ? ans.points : null
        };
      })
    : [];

  const currentRound = round
    ? {
        id: round.id,
        category: round.category || 'Christmas Traditions',
        question: round.question,
        roundNumber: safeIdx + 1,
        totalRounds: bank.length,
        slots: publicSlots
      }
    : null;

  // STRICT MAIN BOARD PRIVACY: NEVER attach unrevealed hostAnswers or private keys
  // to ANY live game-board projection (not even host/admin). Answer keys live exclusively
  // in the Administrator Game Studio (/studio) and Administrator-Only PDF Answer Keys (/pdf/*).

  const basePayload = {
    role,
    canHost: isHostOrAdmin,
    canAdmin: isAdmin,
    roomId: room.roomId,
    locked: Boolean(room.locked),
    edition: room.edition,
    editionMeta: EDITION_META[room.edition] || EDITION_META.classic,
    categories: CHRISTMAS_CATEGORIES,
    disclaimer: GAME_DATA_DISCLAIMER,
    editionsSummary: Object.keys(EDITION_META).map((edKey) => ({
      id: edKey,
      label: EDITION_META[edKey].label,
      shortName: EDITION_META[edKey].shortName,
      count: (room.editionBanks[edKey] || []).length
    })),
    view: room.view,
    version: room.version,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    teams: {
      teamA: { ...room.teams.teamA },
      teamB: { ...room.teams.teamB }
    },
    currentRoundIndex: safeIdx,
    totalRounds: bank.length,
    currentRound,
    roundPoints: room.roundPoints,
    roundPointsTransferred: Boolean(room.roundPointsTransferred),
    transferredToTeam: room.transferredToTeam || null,
    settings: {
      maxStrikes: room.settings.maxStrikes,
      quickPointsStep: room.settings.quickPointsStep,
      soundMusicEnabled: room.settings.soundMusicEnabled,
      soundSfxEnabled: room.settings.soundSfxEnabled,
      allowPlayerGuesses: room.settings.allowPlayerGuesses
    },
    transactions: room.transactions.slice(-50),
    lastBuzz: room.lastBuzz,
    strikeEvent: room.strikeEvent,
    revealEvent: room.revealEvent,
    winnerSummary: buildWinnerSummary(room),
    participants: buildPublicParticipants(room),
    fastMoney: projectFastMoney(room, role)
  };

  if (isHostOrAdmin) {
    basePayload.backupsCount = room.backups.length;
    basePayload.fastMoneyBankCount = room.fastMoneyBank.length;
  }
  if (!isHostOrAdmin && participant) {
    basePayload.self = {
      id: participant.id,
      name: participant.name,
      team: participant.team,
      role: participant.role
    };
  }

  return basePayload;
}

module.exports = {
  timingSafeEqualStr,
  isValidAdminRequest,
  isValidHostRequest,
  getParticipantFromRequest,
  resolveRequestRole,
  computeLiveTimer,
  projectRoomForRole
};
