import React from 'react';

export default function TopBar({
  state,
  activeView,
  connectionStatus,
  musicMuted,
  sfxMuted,
  onNavigate,
  onToggleMusic,
  onToggleSfx,
  onOpenOnline,
  onOpenHistory,
  onOpenHelp,
  onOpenSettings,
  onToggleFullscreen
}) {
  if (activeView === 'home') return null;

  const role = state?.role || 'audience';
  const roundNum = state?.currentRound?.roundNumber || 1;
  const totalRounds = state?.totalRounds || 70;
  const editionLabel = `★ ${(state?.editionMeta?.shortName || 'Classic Edition').toUpperCase()} ★`;

  const roleText =
    role === 'admin'
      ? 'ADMIN'
      : role === 'host'
        ? 'HOST'
        : role === 'player'
          ? `${state?.self?.name || 'PLAYER'} (${
              state?.self?.team === 'teamA'
                ? state?.teams?.teamA?.name || 'TEAM A'
                : state?.teams?.teamB?.name || 'TEAM B'
            })`
          : 'AUDIENCE TV';

  return (
    <header id="topBar" className="top-bar">
      <div className="top-left">
        <button
          type="button"
          className="mini-logo"
          title="Return to Home Stage"
          onClick={() => onNavigate('home')}
        >
          <span className="mini-logo-top">Christmas</span>
          <span className="mini-logo-main">FEUD</span>
        </button>
        <div className="round-badge">
          ROUND {roundNum} OF {totalRounds}
        </div>
        <div className="edition-top-pill">{editionLabel}</div>
        <div className={`role-pill role-${role}`}>{roleText}</div>
      </div>

      <nav className="top-nav" aria-label="Game Navigation">
        <button
          type="button"
          className={`nav-pill ${activeView === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          🏠 Home
        </button>
        <button
          type="button"
          className={`nav-pill ${activeView === 'game' ? 'active' : ''}`}
          onClick={() => onNavigate('game')}
        >
          Main Board
        </button>
        <button
          type="button"
          className={`nav-pill ${activeView === 'fastmoney' ? 'active' : ''}`}
          onClick={() => onNavigate('fastmoney')}
        >
          Fast Money
        </button>
        <button
          type="button"
          className={`nav-pill ${activeView === 'winner' ? 'active' : ''}`}
          onClick={() => onNavigate('winner')}
        >
          Winner
        </button>
        {role === 'admin' && (
          <button
            type="button"
            className={`nav-pill admin-only ${activeView === 'studio' ? 'active' : ''}`}
            onClick={() => onNavigate('studio')}
          >
            Game Studio
          </button>
        )}
        <button type="button" className="nav-pill nav-online" onClick={onOpenOnline}>
          <span className={`live-dot ${connectionStatus !== 'connected' ? 'reconnecting' : ''}`} />
          <span>{state?.roomId || 'ONLINE'}</span>
        </button>
      </nav>

      <div className="top-right">
        <button
          type="button"
          className={`icon-btn ${sfxMuted ? 'muted' : ''}`}
          title="Toggle Sound Effects"
          onClick={onToggleSfx}
        >
          {sfxMuted ? '🔇' : '🔊'}
        </button>
        <button
          type="button"
          className={`icon-btn ${musicMuted ? 'muted' : ''}`}
          title="Toggle Christmas Music"
          onClick={onToggleMusic}
        >
          {musicMuted ? '🔇' : '🎵'}
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Score & Transaction History"
          onClick={onOpenHistory}
        >
          📋
        </button>
        <button
          type="button"
          className="icon-btn"
          title="How to Play & Privacy"
          onClick={onOpenHelp}
        >
          ❓
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Settings & 3D Quality"
          onClick={onOpenSettings}
        >
          ⚙️
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Toggle Fullscreen"
          onClick={onToggleFullscreen}
        >
          ⛶
        </button>
      </div>
    </header>
  );
}
