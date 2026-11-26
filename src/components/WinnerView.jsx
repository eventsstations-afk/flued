import React from 'react';

export default function WinnerView({ state, onWinnerAction, onNavigate, onNewGame }) {
  const ws = state?.winnerSummary || {
    winner: 'tie',
    teamAName: state?.teams?.teamA?.name || 'TEAM A',
    teamAScore: state?.teams?.teamA?.score || 0,
    teamBName: state?.teams?.teamB?.name || 'TEAM B',
    teamBScore: state?.teams?.teamB?.score || 0,
    pointDifference: 0
  };
  const canHost = Boolean(state?.canHost || state?.role === 'admin' || state?.role === 'host');

  const isTie = ws.winner === 'tie';
  const headline = isTie ? '🤝 HOLIDAY SHOWDOWN TIE! 🤝' : '🏆 CHRISTMAS FEUD CHAMPIONS 🏆';
  const banner = isTie ? "IT'S A TIE!" : ws.winner === 'teamA' ? ws.teamAName : ws.teamBName;
  const diffText = isTie
    ? `BOTH TEAMS TIED AT ${ws.teamAScore} POINTS!`
    : ws.pointDifference > 0
      ? `VICTORY BY ${ws.pointDifference} POINTS!`
      : 'CROWNED BY THE GAME SHOW HOST!';

  return (
    <section id="viewWinner" className="view view-winner active">
      <div className="winner-stage-spacer" />
      <div className="winner-card">
        <div className="winner-headline">{headline}</div>
        <div className="winner-team-banner">{banner}</div>
        <div className="winner-diff-text">{diffText}</div>

        <div className="winner-scores-grid">
          <div className="ws-box ws-a">
            <div className="ws-name">{ws.teamAName}</div>
            <div className="ws-score">{ws.teamAScore}</div>
          </div>
          <div className="ws-vs">VS</div>
          <div className="ws-box ws-b">
            <div className="ws-name">{ws.teamBName}</div>
            <div className="ws-score">{ws.teamBScore}</div>
          </div>
        </div>

        {canHost && (
          <div className="winner-host-bar host-only">
            <div className="winner-override-row">
              <button
                type="button"
                className="btn-mini-navy"
                onClick={() => onWinnerAction({ mode: 'auto' })}
              >
                Auto Winner
              </button>
              <button
                type="button"
                className="btn-mini-burgundy"
                onClick={() => onWinnerAction({ mode: 'teamA' })}
              >
                Manual Team A
              </button>
              <button
                type="button"
                className="btn-mini-emerald"
                onClick={() => onWinnerAction({ mode: 'teamB' })}
              >
                Manual Team B
              </button>
              <button
                type="button"
                className="btn-mini-gold"
                onClick={() => onWinnerAction({ mode: 'tie' })}
              >
                Declare Tie
              </button>
              <button
                type="button"
                className="btn-mini-gold"
                onClick={() => onWinnerAction({ action: 'replay' })}
              >
                🎉 Replay Celebration
              </button>
            </div>
            <div className="winner-nav-row">
              <button
                type="button"
                className="btn-pill-navy"
                onClick={() => onNavigate('game')}
              >
                ◀ RETURN TO MAIN GAME
              </button>
              <button
                type="button"
                className="btn-gold"
                onClick={() => onNavigate('fastmoney')}
              >
                ⚡ LAUNCH FAST MONEY
              </button>
              <button type="button" className="btn-emerald-solid" onClick={onNewGame}>
                ✨ START NEW GAME
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
