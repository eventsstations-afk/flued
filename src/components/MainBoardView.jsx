import React, { useEffect, useRef, useState } from 'react';

function TeamGarlandSvg() {
  return (
    <svg className="team-garland-svg" viewBox="0 0 220 26" aria-hidden="true">
      <path
        d="M8,18 Q55,4 110,14 Q165,4 212,18"
        fill="none"
        stroke="#0C6E49"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M18,16 Q60,7 110,14 Q160,7 202,16"
        fill="none"
        stroke="#158F62"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="48" cy="11" r="3.5" fill="#F2C96B" />
      <circle cx="172" cy="11" r="3.5" fill="#F2C96B" />
      <circle cx="76" cy="13" r="3" fill="#E02438" />
      <circle cx="144" cy="13" r="3" fill="#E02438" />
      <path
        d="M100,8 L110,15 L120,8 L118,18 L110,14 L102,18 Z"
        fill="#D4192C"
        stroke="#F2C96B"
        strokeWidth="1"
      />
      <circle cx="110" cy="13" r="4" fill="#F2C96B" />
    </svg>
  );
}

function TeamCabinet({
  teamKey,
  team,
  roster,
  maxStrikes,
  canHost,
  bump,
  onEditTeam,
  onQuickScore,
  onOpenCustom,
  onAddStrike,
  onResetStrikes
}) {
  const strikeCount = team?.strikes || 0;

  return (
    <aside className={`team-panel team-panel-${teamKey === 'teamA' ? 'a' : 'b'}`}>
      <TeamGarlandSvg />
      <div className="team-header">
        <div className="team-title-wrap">
          <h2 className="team-name">{team?.name || (teamKey === 'teamA' ? 'TEAM A' : 'TEAM B')}</h2>
          {canHost && (
            <button
              type="button"
              className="edit-icon-btn host-only"
              title={`Edit ${team?.name || teamKey}`}
              onClick={() => onEditTeam(teamKey)}
            >
              ✎
            </button>
          )}
        </div>
        <div className="team-player">{team?.playerName || ''}</div>
      </div>

      <div className="team-score-box">
        <div className={`team-score ${bump ? 'bump' : ''}`}>{team?.score ?? 0}</div>
      </div>

      <div
        className="strikes-row"
        aria-label={`${team?.name || teamKey} Strikes`}
        style={canHost ? { cursor: 'pointer' } : undefined}
        onClick={() => {
          if (!canHost) return;
          if (strikeCount > 0) onResetStrikes(teamKey);
          else onAddStrike(teamKey);
        }}
        title={canHost ? 'Click to add/reset strikes' : undefined}
      >
        {Array.from({ length: maxStrikes }, (_, i) => (
          <div key={i} className={`strike-circle ${i < strikeCount ? 'active' : ''}`}>
            ✕
          </div>
        ))}
      </div>

      {canHost && (
        <div className="team-controls host-only">
          <button
            type="button"
            className="btn-team-add"
            onClick={() => onQuickScore(teamKey, 'add')}
          >
            + ADD POINTS
          </button>
          <button
            type="button"
            className="btn-team-sub"
            onClick={() => onQuickScore(teamKey, 'subtract')}
          >
            − SUBTRACT POINTS
          </button>
          <button
            type="button"
            className="btn-team-custom"
            onClick={() => onOpenCustom(teamKey)}
          >
            ± CUSTOM POINTS
          </button>
          <button
            type="button"
            className="btn-team-strike"
            onClick={() => onAddStrike(teamKey)}
          >
            ✕ ADD STRIKE
          </button>
        </div>
      )}

      <div className="team-roster">
        {roster.map((p) => (
          <span key={p.id} className="roster-chip">
            {p.connected ? '🟢' : '⚪'} {p.name}
          </span>
        ))}
      </div>
    </aside>
  );
}

/**
 * MAIN TWO-TEAM CHRISTMAS FEUD BOARD
 * Strictly ZERO answer-key section, ZERO hidden answer lists, ZERO unrevealed text/points!
 */
export default function MainBoardView({
  state,
  onClearBuzz,
  onEditTeam,
  onQuickScore,
  onOpenCustom,
  onAddStrike,
  onResetStrikes,
  onRevealSlot,
  onRevealNext,
  onRevealAll,
  onHideAnswers,
  onPrevRound,
  onNextRound,
  onResetRound,
  onTransferTeam,
  onUndo,
  onNavigate,
  onPlayerBuzz
}) {
  const canHost = Boolean(state?.canHost || state?.role === 'admin' || state?.role === 'host');
  const round = state?.currentRound;
  const maxStrikes = state?.settings?.maxStrikes || 3;
  const teamA = state?.teams?.teamA || { name: 'TEAM A', playerName: '', score: 0, strikes: 0 };
  const teamB = state?.teams?.teamB || { name: 'TEAM B', playerName: '', score: 0, strikes: 0 };

  const [bumpA, setBumpA] = useState(false);
  const [bumpB, setBumpB] = useState(false);
  const prevScoresRef = useRef({ teamA: teamA.score, teamB: teamB.score });

  useEffect(() => {
    let tA;
    let tB;
    if (prevScoresRef.current.teamA !== teamA.score) {
      setBumpA(true);
      tA = setTimeout(() => setBumpA(false), 450);
    }
    if (prevScoresRef.current.teamB !== teamB.score) {
      setBumpB(true);
      tB = setTimeout(() => setBumpB(false), 450);
    }
    prevScoresRef.current = { teamA: teamA.score, teamB: teamB.score };
    return () => {
      if (tA) clearTimeout(tA);
      if (tB) clearTimeout(tB);
    };
  }, [teamA.score, teamB.score]);

  const participants = state?.participants || [];
  const rosterA = participants.filter((p) => p.team === 'teamA');
  const rosterB = participants.filter((p) => p.team === 'teamB');

  const slots = round?.slots || [];
  const revCount = slots.filter((s) => s.revealed).length;
  const roundPoints = state?.roundPoints || 0;
  const canTransfer = roundPoints > 0 && !state?.roundPointsTransferred;
  const editionRibbon = `★ ${(state?.editionMeta?.shortName || 'Classic Edition').toUpperCase()} ★`;

  const buzzTeamLabel = state?.lastBuzz
    ? state.lastBuzz.team === 'teamA'
      ? teamA.name
      : state.lastBuzz.team === 'teamB'
        ? teamB.name
        : 'PLAYER'
    : '';

  return (
    <section id="viewGame" className="view view-game active">
      {state?.lastBuzz && (
        <div className="buzz-banner">
          <span>
            🔔 BUZZ IN! {state.lastBuzz.name} ({buzzTeamLabel}) buzzed in!
          </span>
          {canHost && (
            <button type="button" className="btn-mini-gold host-only" onClick={onClearBuzz}>
              Clear
            </button>
          )}
        </div>
      )}

      {/* Crowned Broadcast Emblem above Board */}
      <div className="board-crown-header" aria-hidden="true">
        <div className="crown-logo-crest">
          <span className="crown-title-top">Christmas</span>
          <span className="crown-title-feud">FEUD</span>
          <span className="crown-edition-ribbon">{editionRibbon}</span>
        </div>
      </div>

      {/* Mobile Compact Score Strip */}
      <div className="mobile-score-strip">
        <div className="mob-team mob-team-a">
          <div className="mob-t-name">{teamA.name}</div>
          <div className="mob-t-score">{teamA.score}</div>
          <div className="mob-t-strikes">
            {Array.from({ length: maxStrikes }, (_, i) => (
              <span key={i} className={`mob-dot ${i < (teamA.strikes || 0) ? 'active' : ''}`}>
                ✕
              </span>
            ))}
          </div>
        </div>
        <div className="mob-bank">
          <div className="mob-bank-lbl">ROUND</div>
          <div className="mob-bank-val">{roundPoints}</div>
        </div>
        <div className="mob-team mob-team-b">
          <div className="mob-t-name">{teamB.name}</div>
          <div className="mob-t-score">{teamB.score}</div>
          <div className="mob-t-strikes">
            {Array.from({ length: maxStrikes }, (_, i) => (
              <span key={i} className={`mob-dot ${i < (teamB.strikes || 0) ? 'active' : ''}`}>
                ✕
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column 16:9 Television Game-Show Grid */}
      <div className="game-stage-grid">
        <TeamCabinet
          teamKey="teamA"
          team={teamA}
          roster={rosterA}
          maxStrikes={maxStrikes}
          canHost={canHost}
          bump={bumpA}
          onEditTeam={onEditTeam}
          onQuickScore={onQuickScore}
          onOpenCustom={onOpenCustom}
          onAddStrike={onAddStrike}
          onResetStrikes={onResetStrikes}
        />

        {/* CENTER EMERALD SURVEY BOARD — ONLY 8 NUMBERED HIDDEN/REVEALED SLOTS */}
        <main className="board-center">
          <div className="question-frame">
            <div className="question-meta">
              <span className="q-cat-pill">
                ★ {(round?.category || 'CHRISTMAS TRADITIONS').toUpperCase()} ★
              </span>
            </div>
            <h1 className="question-text">{round?.question || 'Loading survey question...'}</h1>
          </div>

          <div className="answers-board" aria-label="Survey Answer Slots">
            {slots.map((slot, idx) => (
              <div
                key={`${state?.edition}:${round?.id}:${idx}`}
                className={`answer-slot ${slot.revealed ? 'revealed' : ''} ${
                  canHost ? 'host-clickable' : ''
                }`}
                onClick={() => {
                  if (canHost && !slot.revealed) onRevealSlot(idx);
                }}
              >
                <div className="answer-card-3d">
                  <div className="answer-face answer-front">
                    <span className="slot-rank-badge">{slot.rank}</span>
                    <span className="slot-qmark">?</span>
                    <span style={{ width: 40 }} />
                  </div>
                  <div className="answer-face answer-back">
                    <span className="slot-rank-badge">{slot.rank}</span>
                    <span className="answer-text">{slot.revealed ? slot.text : ''}</span>
                    <span className="answer-points">{slot.revealed ? slot.points : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="round-bank-bar">
            <div className="bank-pill">
              <span className="bank-label">ROUND POINTS:</span>
              <span className="bank-value">{roundPoints}</span>
              <span className="bank-denom">/ 100</span>
              {state?.roundPointsTransferred && state?.transferredToTeam && (
                <span className="bank-status-tag">
                  AWARDED TO {state.teams?.[state.transferredToTeam]?.name || 'TEAM'}
                </span>
              )}
            </div>
            <div className="revealed-pill">
              <span className="bank-sub-info">ANSWERS REVEALED: {revCount} OF 8</span>
            </div>
          </div>

          {state?.role === 'player' && (
            <div className="player-action-bar player-only">
              <button type="button" className="btn-buzz-in" onClick={onPlayerBuzz}>
                🔔 BUZZ IN!
              </button>
            </div>
          )}
        </main>

        <TeamCabinet
          teamKey="teamB"
          team={teamB}
          roster={rosterB}
          maxStrikes={maxStrikes}
          canHost={canHost}
          bump={bumpB}
          onEditTeam={onEditTeam}
          onQuickScore={onQuickScore}
          onOpenCustom={onOpenCustom}
          onAddStrike={onAddStrike}
          onResetStrikes={onResetStrikes}
        />
      </div>

      {canHost && (
        <footer className="bottom-dock host-only">
          <button type="button" className="dock-btn dock-navy" onClick={onPrevRound}>
            ◀ PREV
          </button>
          <button type="button" className="dock-btn dock-navy" onClick={onNextRound}>
            NEXT ▶
          </button>
          <button type="button" className="dock-btn dock-emerald" onClick={onRevealNext}>
            ▶ REVEAL ANSWER
          </button>
          <button type="button" className="dock-btn dock-burgundy" onClick={onRevealAll}>
            📚 REVEAL ALL
          </button>
          <button type="button" className="dock-btn dock-burgundy" onClick={onHideAnswers}>
            🙈 HIDE ANSWERS
          </button>
          <button type="button" className="dock-btn dock-burgundy" onClick={onResetRound}>
            ↺ RESET ROUND
          </button>
          <button
            type="button"
            className="dock-btn dock-emerald"
            disabled={!canTransfer}
            onClick={() => onTransferTeam('teamA')}
          >
            ➡ SEND TO {teamA.name}
          </button>
          <button
            type="button"
            className="dock-btn dock-emerald"
            disabled={!canTransfer}
            onClick={() => onTransferTeam('teamB')}
          >
            ➡ SEND TO {teamB.name}
          </button>
          <button
            type="button"
            className="dock-btn dock-navy"
            title="Undo Last Score Transaction"
            onClick={onUndo}
          >
            ↶ UNDO
          </button>
          <button
            type="button"
            className="dock-btn dock-gold"
            onClick={() => onNavigate('winner')}
          >
            🏆 WINNER
          </button>
          <button
            type="button"
            className="dock-btn dock-crimson"
            onClick={() => onNavigate('fastmoney')}
          >
            ⚡ FAST MONEY
          </button>
        </footer>
      )}
    </section>
  );
}
