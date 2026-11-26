import React, { useEffect, useRef, useState } from 'react';
import { audio } from '../services/audio.js';

const TIMER_PRESETS = [5, 10, 15, 20, 25, 30];

/**
 * CHRISTMAS FEUD (REACT) — DEDICATED FAST MONEY ROUND
 * STRICT PRIVACY & MANUAL SCORING COMPLIANCE:
 *  - ZERO live answer reveals
 *  - ZERO live answer keys or accepted-answer lists
 *  - ZERO automatic answer/synonym matching
 *  - Synchronized timers (5-30s presets + custom, +5s, +10s, Pause, Resume, Reset, Skip, Lock)
 *  - Private Host Manual Scoring Summary with per-response points, text editing, and manual bonus
 */
export default function FastMoneyView({
  state,
  api,
  onToast,
  onActionError,
  onTriggerCelebration
}) {
  const fm = state?.fastMoney;
  const cfg = fm?.config || {
    participatingTeam: 'teamA',
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    targetScore: 200,
    questionsPerPlayer: 5,
    p1Duration: 20,
    p2Duration: 25,
    questionSet: 1,
    p2OrderMode: 'shuffled'
  };
  const canHost = Boolean(state?.canHost);
  const canAdmin = Boolean(state?.canAdmin);

  // Setup controlled form state
  const [setupForm, setSetupForm] = useState(cfg);
  const [answerText, setAnswerText] = useState('');
  const [displaySeconds, setDisplaySeconds] = useState(fm?.timer?.displaySeconds ?? 20);
  const [editingResp, setEditingResp] = useState(null); // { key: '1:0', playerNum, canonicalIndex, value }
  const answerInputRef = useRef(null);
  const lastTickSecRef = useRef(null);

  // Sync setup form when entering setup phase or server config changes
  useEffect(() => {
    if (fm?.phase === 'setup' && fm?.config) {
      setSetupForm({ ...fm.config });
    }
  }, [
    fm?.phase,
    fm?.config?.participatingTeam,
    fm?.config?.player1Name,
    fm?.config?.player2Name,
    fm?.config?.targetScore,
    fm?.config?.questionsPerPlayer,
    fm?.config?.p1Duration,
    fm?.config?.p2Duration,
    fm?.config?.questionSet,
    fm?.config?.p2OrderMode
  ]);

  // Auto-focus live answer input when moving to next question
  useEffect(() => {
    if (fm?.phase === 'p1' || fm?.phase === 'p2') {
      setAnswerText('');
      const t = setTimeout(() => answerInputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [fm?.phase, fm?.currentQuestionIndex]);

  // Synchronized countdown timer tick during p1 / p2
  useEffect(() => {
    if (!fm || (fm.phase !== 'p1' && fm.phase !== 'p2') || !fm.timer) {
      lastTickSecRef.current = null;
      return undefined;
    }

    const baseRem = Number(fm.timer.remainingSeconds) || 0;
    const syncedAt = Date.now();
    const isRunning = Boolean(fm.timer.running);

    const tick = () => {
      const rem = isRunning ? Math.max(0, baseRem - (Date.now() - syncedAt) / 1000) : baseRem;
      const disp = Math.ceil(rem);
      setDisplaySeconds(disp);
      if (isRunning && disp !== lastTickSecRef.current) {
        lastTickSecRef.current = disp;
        if (disp > 0 && disp <= 10) audio.playTick(disp <= 5);
        else if (disp === 0) audio.playTimesUp();
      }
    };

    tick();
    if (!isRunning) return undefined;
    const interval = setInterval(tick, 150);
    return () => clearInterval(interval);
  }, [fm?.phase, fm?.timer?.remainingSeconds, fm?.timer?.running, fm?.timer?.updatedAt]);

  // Trigger 3D celebration if final published result is won
  useEffect(() => {
    if (fm?.phase === 'final' && fm?.result?.won) {
      onTriggerCelebration?.(10);
    }
  }, [fm?.phase, fm?.result?.won, onTriggerCelebration]);

  if (!fm) return null;

  const phaseNames = {
    setup: 'SETUP & TIMER CONFIGURATION',
    p1: `PLAYER 1 — ${cfg.player1Name.toUpperCase()}`,
    p1_done: 'PLAYER 1 SAVED & LOCKED • READY FOR PLAYER 2',
    p2: `PLAYER 2 — ${cfg.player2Name.toUpperCase()}`,
    scoring: 'SUBMISSIONS LOCKED • PRIVATE HOST MANUAL SCORING',
    final: 'FAST MONEY RESULTS'
  };

  const handleDownloadFmPdf = () => {
    api
      .downloadAnswerKeyPdf('fast-money')
      .then((fn) => onToast(`Downloaded ${fn}`, 'success'))
      .catch(onActionError);
  };

  const handleStartSetup = async (e) => {
    e.preventDefault();
    try {
      await api.fmStart({
        participatingTeam: setupForm.participatingTeam,
        player1Name: String(setupForm.player1Name || '').trim() || 'Player 1',
        player2Name: String(setupForm.player2Name || '').trim() || 'Player 2',
        targetScore: parseInt(setupForm.targetScore, 10) || 200,
        questionsPerPlayer: parseInt(setupForm.questionsPerPlayer, 10) || 5,
        p1Duration: parseInt(setupForm.p1Duration, 10) || 20,
        p2Duration: parseInt(setupForm.p2Duration, 10) || 25,
        questionSet: parseInt(setupForm.questionSet, 10) || 1,
        p2OrderMode: setupForm.p2OrderMode
      });
      onToast('Fast Money started! Player 1 is live!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleSubmitLiveAnswer = async (e, playerNum, qIdx) => {
    e.preventDefault();
    try {
      await api.fmSubmit(playerNum, answerText.trim(), qIdx);
      setAnswerText('');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleSaveEditedResp = async () => {
    if (!editingResp) return;
    try {
      await api.fmManualScore({
        playerNum: editingResp.playerNum,
        canonicalIndex: editingResp.canonicalIndex,
        answerText: editingResp.value
      });
      setEditingResp(null);
      onToast('Response text updated.', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  return (
    <section id="viewFastMoney" className="view view-fastmoney active">
      <div className="fm-wrapper">
        <div className="fm-header-banner">
          <div className="fm-title-pill">FAST MONEY ROUND</div>
          <div className="fm-header-sub">{phaseNames[fm.phase] || 'FAST MONEY ROUND'}</div>
        </div>

        <div className="fm-stage-container">
          {/* 1. SETUP PHASE */}
          {fm.phase === 'setup' && !canHost && (
            <div className="fm-card" style={{ textAlign: 'center', padding: '34px 20px' }}>
              <h2 style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: 10 }}>
                🎄 FAST MONEY ROUND PREPARING...
              </h2>
              <p style={{ fontSize: '1rem' }}>
                Participating Team:{' '}
                <strong>{state?.teams?.[cfg.participatingTeam]?.name || 'TEAM A'}</strong> • Players:{' '}
                <strong>{cfg.player1Name}</strong> &amp; <strong>{cfg.player2Name}</strong>
              </p>
              <p style={{ marginTop: 8, opacity: 0.82 }}>
                Target Score: <strong>{cfg.targetScore}</strong> • {cfg.questionsPerPlayer} Questions
                per Player
              </p>
              <p style={{ marginTop: 14, color: 'var(--gold)', fontWeight: 700 }}>
                Waiting for the Host to launch Player 1!
              </p>
            </div>
          )}

          {fm.phase === 'setup' && canHost && (
            <div className="fm-card">
              <form onSubmit={handleStartSetup}>
                <div className="fm-setup-grid">
                  <div className="fm-field">
                    <label>Participating Team</label>
                    <select
                      value={setupForm.participatingTeam}
                      onChange={(e) =>
                        setSetupForm((f) => ({ ...f, participatingTeam: e.target.value }))
                      }
                    >
                      <option value="teamA">
                        {state?.teams?.teamA?.name || 'TEAM A'} (Team A)
                      </option>
                      <option value="teamB">
                        {state?.teams?.teamB?.name || 'TEAM B'} (Team B)
                      </option>
                    </select>
                  </div>

                  <div className="fm-field">
                    <label>Player One Name</label>
                    <input
                      type="text"
                      maxLength={32}
                      value={setupForm.player1Name}
                      onChange={(e) => setSetupForm((f) => ({ ...f, player1Name: e.target.value }))}
                    />
                  </div>

                  <div className="fm-field">
                    <label>Player Two Name</label>
                    <input
                      type="text"
                      maxLength={32}
                      value={setupForm.player2Name}
                      onChange={(e) => setSetupForm((f) => ({ ...f, player2Name: e.target.value }))}
                    />
                  </div>

                  <div className="fm-field">
                    <label>Target Score</label>
                    <input
                      type="number"
                      min={50}
                      max={500}
                      value={setupForm.targetScore}
                      onChange={(e) => setSetupForm((f) => ({ ...f, targetScore: e.target.value }))}
                    />
                  </div>

                  <div className="fm-field">
                    <label>Questions Per Player</label>
                    <input
                      type="number"
                      min={3}
                      max={10}
                      value={setupForm.questionsPerPlayer}
                      onChange={(e) =>
                        setSetupForm((f) => ({ ...f, questionsPerPlayer: e.target.value }))
                      }
                    />
                  </div>

                  <div className="fm-field">
                    <label>Question Set (1–6)</label>
                    <select
                      value={setupForm.questionSet}
                      onChange={(e) =>
                        setSetupForm((f) => ({ ...f, questionSet: Number(e.target.value) }))
                      }
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          All-Christmas Set #{n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="fm-field">
                    <label>Player 1 Countdown (5–30s or Custom)</label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={setupForm.p1Duration}
                      onChange={(e) => setSetupForm((f) => ({ ...f, p1Duration: e.target.value }))}
                    />
                    <div className="timer-preset-row">
                      {TIMER_PRESETS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`preset-btn ${Number(setupForm.p1Duration) === s ? 'active' : ''}`}
                          onClick={() => setSetupForm((f) => ({ ...f, p1Duration: s }))}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fm-field">
                    <label>Player 2 Countdown (5–30s or Custom)</label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={setupForm.p2Duration}
                      onChange={(e) => setSetupForm((f) => ({ ...f, p2Duration: e.target.value }))}
                    />
                    <div className="timer-preset-row">
                      {TIMER_PRESETS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`preset-btn ${Number(setupForm.p2Duration) === s ? 'active' : ''}`}
                          onClick={() => setSetupForm((f) => ({ ...f, p2Duration: s }))}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fm-field">
                    <label>Player 2 Question Order</label>
                    <select
                      value={setupForm.p2OrderMode}
                      onChange={(e) => setSetupForm((f) => ({ ...f, p2OrderMode: e.target.value }))}
                    >
                      <option value="shuffled">Same Questions — Different Order (Default)</option>
                      <option value="same">Same Questions — Same Order</option>
                      <option value="alternate_set">Alternative Question Set</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(11,22,41,0.72)',
                    border: '1px solid var(--gold-soft)',
                    fontSize: '0.78rem',
                    marginBottom: 14,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8
                  }}
                >
                  <span>
                    🔒 <strong>Private Scoring Mode:</strong> Live Fast Money never displays answer
                    keys or auto-matches responses. Score manually after both players finish using
                    your Administrator PDF Answer Key.
                  </span>
                  {canAdmin && (
                    <button type="button" className="btn-mini-gold" onClick={handleDownloadFmPdf}>
                      📄 Download Fast Money Answer Key PDF
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-pill-navy"
                    onClick={() => api.setView('game').catch(onActionError)}
                  >
                    ◀ RETURN TO MAIN GAME
                  </button>
                  <button type="submit" className="btn-hero-gold" style={{ minWidth: 260 }}>
                    ▶ START FAST MONEY
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. LIVE PLAYER 1 / PLAYER 2 TURN (ZERO ANSWER KEYS, ZERO MATCHING) */}
          {(fm.phase === 'p1' || fm.phase === 'p2') && (() => {
            const playerNum = fm.phase === 'p1' ? 1 : 2;
            const pName = playerNum === 1 ? cfg.player1Name : cfg.player2Name;
            const qIdx = fm.currentQuestionIndex || 0;
            const totalQ = fm.totalQuestions || cfg.questionsPerPlayer || 5;
            const canSubmit = state?.role === 'player' || canHost;
            const isUrgent = Boolean(fm.timer?.running && displaySeconds <= 5 && displaySeconds > 0);

            return (
              <div className="fm-card">
                <div className="fm-live-top">
                  <div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: 'var(--gold)',
                        letterSpacing: '0.1em'
                      }}
                    >
                      PLAYER {playerNum} • QUESTION {Math.min(qIdx + 1, totalQ)} OF {totalQ}
                      {fm.currentCategory ? ` • ${fm.currentCategory.toUpperCase()}` : ''}
                    </div>
                    <h2 style={{ fontSize: '1.65rem', fontWeight: 900, marginTop: 2 }}>{pName}</h2>
                    {playerNum === 2 && (
                      <div style={{ fontSize: '0.76rem', color: '#89F7C2', marginTop: 3 }}>
                        🔒 Player 1’s submissions are completely hidden and locked on the server.
                      </div>
                    )}
                  </div>
                  <div className={`fm-timer-ring ${isUrgent ? 'urgent' : ''}`}>
                    <div className="fm-timer-num">{displaySeconds}</div>
                    <div className="fm-timer-unit">SECONDS</div>
                  </div>
                </div>

                <div className="fm-progress-dots">
                  {(fm.playerProgress || []).map((s, i) => (
                    <span
                      key={i}
                      className={`fm-prog-dot ${
                        s.locked ? 'locked' : i === qIdx ? 'current' : ''
                      }`}
                    >
                      Q{i + 1} {s.skipped ? '⏭' : s.locked ? '🔒' : ''}
                    </span>
                  ))}
                </div>

                <div className="fm-question-box">
                  <div className="fm-q-text">
                    {fm.currentPrompt || 'Waiting for next question...'}
                  </div>
                </div>

                {canSubmit ? (
                  <form
                    className="fm-answer-form"
                    onSubmit={(e) => handleSubmitLiveAnswer(e, playerNum, qIdx)}
                  >
                    <input
                      ref={answerInputRef}
                      type="text"
                      placeholder="Type your answer..."
                      maxLength={100}
                      autoComplete="off"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                    />
                    <button type="submit" className="btn-emerald-solid" style={{ minWidth: 160 }}>
                      SUBMIT
                    </button>
                  </form>
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>
                    Audience Display — Submissions are saved privately until the Host publishes
                    final scores.
                  </p>
                )}

                {canHost && (
                  <div className="fm-host-timer-bar">
                    <strong style={{ color: 'var(--gold)', fontSize: '0.76rem' }}>
                      HOST CONTROLS:
                    </strong>
                    <button
                      type="button"
                      className="btn-mini-emerald"
                      onClick={() =>
                        api.fmTimer(fm.timer?.running ? 'pause' : 'resume', 0).catch(onActionError)
                      }
                    >
                      {fm.timer?.running ? '⏸ Pause' : '▶ Resume'}
                    </button>
                    <button
                      type="button"
                      className="btn-mini-gold"
                      onClick={() => api.fmTimer('add', 5).catch(onActionError)}
                    >
                      +5s
                    </button>
                    <button
                      type="button"
                      className="btn-mini-gold"
                      onClick={() => api.fmTimer('add', 10).catch(onActionError)}
                    >
                      +10s
                    </button>
                    <button
                      type="button"
                      className="btn-mini-navy"
                      onClick={() => api.fmTimer('reset', 0).catch(onActionError)}
                    >
                      ↺ Reset Timer
                    </button>
                    <button
                      type="button"
                      className="btn-mini-navy"
                      onClick={() => api.fmSkip(playerNum).catch(onActionError)}
                    >
                      ⏭ Skip Question
                    </button>
                    <button
                      type="button"
                      className="btn-mini-burgundy"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => api.fmLockTurn(playerNum).catch(onActionError)}
                    >
                      🔒 Finish &amp; Lock Player {playerNum}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 3. BETWEEN PLAYER 1 & PLAYER 2 */}
          {fm.phase === 'p1_done' && (
            <div className="fm-card" style={{ textAlign: 'center', padding: '34px 24px' }}>
              <h2 style={{ color: 'var(--gold)', fontSize: '1.75rem', marginBottom: 10 }}>
                🔒 {cfg.player1Name} IS LOCKED IN!
              </h2>
              <p style={{ fontSize: '1rem', maxWidth: 620, margin: '0 auto', lineHeight: 1.5 }}>
                All {fm.totalQuestions} submissions from <strong>{cfg.player1Name}</strong> have
                been saved privately on the server and are hidden from{' '}
                <strong>{cfg.player2Name}</strong>.
              </p>
              <div
                style={{
                  marginTop: 22,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 12,
                  flexWrap: 'wrap'
                }}
              >
                {canHost ? (
                  <>
                    <button
                      type="button"
                      className="btn-hero-gold"
                      style={{ minWidth: 260 }}
                      onClick={() => api.fmStartP2().catch(onActionError)}
                    >
                      ▶ START PLAYER 2 ({cfg.player2Name})
                    </button>
                    <button
                      type="button"
                      className="btn-pill-navy"
                      onClick={() => api.fmReset().catch(onActionError)}
                    >
                      ↺ Back to Setup
                    </button>
                  </>
                ) : (
                  <div style={{ color: 'var(--gold)', fontWeight: 800 }}>
                    Ready for {cfg.player2Name} — waiting for Host!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. PRIVATE HOST MANUAL SCORING SUMMARY */}
          {fm.phase === 'scoring' && !canHost && (
            <div className="fm-card" style={{ textAlign: 'center', padding: '36px 24px' }}>
              <h2 style={{ color: 'var(--gold)', fontSize: '1.8rem', marginBottom: 10 }}>
                🔒 BOTH PLAYERS LOCKED IN!
              </h2>
              <p style={{ fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
                <strong>{cfg.player1Name}</strong> and <strong>{cfg.player2Name}</strong> have
                finished! The Host is manually tallying Fast Money scores now. Stand by for the
                official result!
              </p>
            </div>
          )}

          {fm.phase === 'scoring' && canHost && (() => {
            const rows = fm.hostScoringRows || [];
            const totals = fm.totals || { p1Score: 0, p2Score: 0, bonusPoints: 0, combinedScore: 0 };

            return (
              <div className="fm-card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 10,
                    marginBottom: 12
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 900, color: 'var(--gold)', fontSize: '0.95rem' }}>
                      PRIVATE HOST MANUAL SCORING SUMMARY
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--ivory-muted)' }}>
                      Evaluate using your separate Private Fast Money PDF Answer Key or Admin
                      Dashboard. Enter points manually for each response.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canAdmin && (
                      <button type="button" className="btn-mini-gold" onClick={handleDownloadFmPdf}>
                        📄 Download Fast Money Answer Key PDF
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-mini-navy"
                      onClick={() => api.fmReset().catch(onActionError)}
                    >
                      ↺ Restart Fast Money
                    </button>
                  </div>
                </div>

                <div className="fm-manual-table">
                  {rows.map((r) => (
                    <div key={r.canonicalIndex} className="fm-manual-row">
                      <div className="studio-num-tag">Q{r.questionNumber}</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{r.questionText}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gold)', marginTop: 2 }}>
                          {r.category}
                        </div>
                      </div>

                      {[1, 2].map((pNum) => {
                        const key = `${pNum}:${r.canonicalIndex}`;
                        const pName = pNum === 1 ? cfg.player1Name : cfg.player2Name;
                        const pSkipped = pNum === 1 ? r.p1Skipped : r.p2Skipped;
                        const pAns = pNum === 1 ? r.p1Answer : r.p2Answer;
                        const pPts = pNum === 1 ? r.p1Points : r.p2Points;
                        const isEditing = editingResp?.key === key;

                        return (
                          <div key={pNum} className="fm-resp-card">
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.72rem',
                                color: 'var(--gold)',
                                fontWeight: 800
                              }}
                            >
                              <span>{pName}</span>
                              {!isEditing && (
                                <button
                                  type="button"
                                  className="link-btn"
                                  style={{ fontSize: '0.68rem' }}
                                  onClick={() =>
                                    setEditingResp({
                                      key,
                                      playerNum: pNum,
                                      canonicalIndex: r.canonicalIndex,
                                      value: pAns || ''
                                    })
                                  }
                                >
                                  Edit Text
                                </button>
                              )}
                            </div>

                            {isEditing ? (
                              <div style={{ display: 'flex', gap: 5 }}>
                                <input
                                  type="text"
                                  value={editingResp.value}
                                  onChange={(e) =>
                                    setEditingResp((prev) => ({ ...prev, value: e.target.value }))
                                  }
                                  style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                                />
                                <button
                                  type="button"
                                  className="btn-mini-emerald"
                                  onClick={handleSaveEditedResp}
                                >
                                  ✓
                                </button>
                                <button
                                  type="button"
                                  className="btn-mini-navy"
                                  onClick={() => setEditingResp(null)}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                                {pSkipped ? (
                                  <em style={{ opacity: 0.65 }}>(Skipped)</em>
                                ) : (
                                  pAns || '(No Answer)'
                                )}
                              </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <label
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                Points:
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                defaultValue={pPts}
                                key={`${key}:${pPts}`}
                                style={{ padding: '5px 8px' }}
                                onBlur={(e) => {
                                  const pts = Math.max(
                                    0,
                                    Math.min(100, parseInt(e.target.value, 10) || 0)
                                  );
                                  if (pts !== pPts) {
                                    api
                                      .fmManualScore({
                                        playerNum: pNum,
                                        canonicalIndex: r.canonicalIndex,
                                        points: pts
                                      })
                                      .catch(onActionError);
                                  }
                                }}
                                onChange={(e) => {
                                  const pts = Math.max(
                                    0,
                                    Math.min(100, parseInt(e.target.value, 10) || 0)
                                  );
                                  api
                                    .fmManualScore({
                                      playerNum: pNum,
                                      canonicalIndex: r.canonicalIndex,
                                      points: pts
                                    })
                                    .catch(onActionError);
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1.2fr',
                    gap: 12,
                    marginTop: 14,
                    alignItems: 'center'
                  }}
                >
                  <div className="fm-score-tile">
                    <div className="fm-score-tile-lbl">{cfg.player1Name}</div>
                    <div className="fm-score-tile-num">{totals.p1Score}</div>
                  </div>
                  <div className="fm-score-tile">
                    <div className="fm-score-tile-lbl">{cfg.player2Name}</div>
                    <div className="fm-score-tile-num">{totals.p2Score}</div>
                  </div>
                  <div className="fm-score-tile combined">
                    <div className="fm-score-tile-lbl">MANUAL BONUS</div>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={fm.manualBonusPoints || 0}
                      style={{
                        marginTop: 8,
                        textAlign: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 900
                      }}
                      onChange={(e) => {
                        const bonus = Math.max(0, Math.min(500, parseInt(e.target.value, 10) || 0));
                        api.fmManualBonus(bonus).catch(onActionError);
                      }}
                    />
                  </div>
                  <div
                    className="fm-score-tile combined"
                    style={{
                      borderColor: 'var(--gold)',
                      background:
                        'linear-gradient(180deg, var(--emerald-bright), var(--emerald-deep))'
                    }}
                  >
                    <div className="fm-score-tile-lbl">COMBINED / TARGET {cfg.targetScore}</div>
                    <div className="fm-score-tile-num" style={{ color: 'var(--gold)' }}>
                      {totals.combinedScore}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 12,
                    marginTop: 18,
                    flexWrap: 'wrap'
                  }}
                >
                  <button
                    type="button"
                    className="btn-hero-gold"
                    style={{ minWidth: 300 }}
                    onClick={() => api.fmPublishResult().catch(onActionError)}
                  >
                    📢 PUBLISH FINAL FAST MONEY RESULT
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 5. FINAL PUBLISHED FAST MONEY RESULT */}
          {fm.phase === 'final' && (() => {
            const res = fm.result || {
              won: false,
              p1Score: 0,
              p2Score: 0,
              bonusPoints: 0,
              combinedScore: 0,
              targetScore: cfg.targetScore
            };

            return (
              <div className="fm-card">
                <div className="fm-final-showcase">
                  <div className="fm-score-tile">
                    <div className="fm-score-tile-lbl">PLAYER 1 • {cfg.player1Name}</div>
                    <div className="fm-score-tile-num">{res.p1Score}</div>
                  </div>
                  <div className="fm-score-tile combined">
                    <div className="fm-score-tile-lbl">COMBINED SCORE</div>
                    <div className="fm-score-tile-num" style={{ color: 'var(--gold)' }}>
                      {res.combinedScore}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        marginTop: 4,
                        color: 'var(--ivory-muted)'
                      }}
                    >
                      TARGET: {res.targetScore}
                      {res.bonusPoints > 0 ? ` • (+${res.bonusPoints} Bonus)` : ''}
                    </div>
                  </div>
                  <div className="fm-score-tile">
                    <div className="fm-score-tile-lbl">PLAYER 2 • {cfg.player2Name}</div>
                    <div className="fm-score-tile-num">{res.p2Score}</div>
                  </div>
                </div>

                <div className={`fm-final-banner ${res.won ? 'won' : 'lost'}`}>
                  <div className="fm-final-title">
                    {res.won ? '✓ CHRISTMAS FAST MONEY WON!' : '🎄 FAST MONEY NOT WON'}
                  </div>
                </div>

                {canHost && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 12,
                      flexWrap: 'wrap',
                      marginTop: 18
                    }}
                  >
                    <button
                      type="button"
                      className="btn-pill-navy"
                      onClick={() => api.setView('game').catch(onActionError)}
                    >
                      ◀ RETURN TO MAIN GAME
                    </button>
                    <button
                      type="button"
                      className="btn-hero-gold"
                      onClick={() => api.fmReset().catch(onActionError)}
                    >
                      ↺ PLAY FAST MONEY AGAIN
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
