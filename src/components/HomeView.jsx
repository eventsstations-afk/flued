import React, { useEffect, useState } from 'react';

const EDITIONS = [
  { id: 'classic', label: '70 ROUNDS – CLASSIC' },
  { id: 'deluxe', label: '100 ROUNDS – DELUXE' },
  { id: 'ultimate', label: '150 ROUNDS – ULTIMATE' }
];

export default function HomeView({
  selectedEdition,
  onSelectEdition,
  onLaunchView,
  onOpenOnline,
  onOpenSettings,
  onOpenHistory,
  onOpenHelp,
  onOpenPinSignIn,
  onJoinRoom,
  musicMuted,
  sfxMuted,
  onToggleMusic,
  onToggleSfx,
  onToggleFullscreen,
  initialRoomCode = ''
}) {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [nickname, setNickname] = useState('');
  const [team, setTeam] = useState('teamA');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (initialRoomCode) setRoomCode(initialRoomCode);
  }, [initialRoomCode]);

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const rid = roomCode.trim().toUpperCase();
    const name = nickname.trim();
    if (!rid || !name || joining) return;
    setJoining(true);
    try {
      await onJoinRoom(rid, { name, team });
    } finally {
      setJoining(false);
    }
  };

  return (
    <section id="viewHome" className="view view-home active">
      <div className="home-top-utility">
        <div className="edition-badge-top">
          <span>🎄</span>
          <span>THE ULTIMATE CHRISTMAS GAME SHOW</span>
        </div>
        <div className="home-top-btns">
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
            className={`icon-btn ${sfxMuted ? 'muted' : ''}`}
            title="Toggle Sound Effects"
            onClick={onToggleSfx}
          >
            {sfxMuted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            className="icon-btn"
            title="Fullscreen"
            onClick={onToggleFullscreen}
          >
            ⛶
          </button>
        </div>
      </div>

      <div className="home-stage-window">
        <div className="home-title-fallback" aria-label="Christmas FEUD Classic Edition">
          <div className="ht-top">Christmas</div>
          <div className="ht-main">FEUD</div>
          <div className="ht-sub">THE ULTIMATE CHRISTMAS GAME SHOW</div>
        </div>
      </div>

      <div className="home-console">
        <div className="home-primary-panel">
          <div className="edition-selector-row" role="group" aria-label="Select Game Edition">
            {EDITIONS.map((ed) => (
              <button
                key={ed.id}
                type="button"
                className={`edition-chip ${selectedEdition === ed.id ? 'active' : ''}`}
                onClick={() => onSelectEdition(ed.id)}
              >
                {ed.label}
              </button>
            ))}
          </div>

          <div className="home-cta-stack">
            <button type="button" className="btn-hero-gold" onClick={() => onLaunchView('game')}>
              <span>▶</span> PLAY GAME
            </button>
            <button
              type="button"
              className="btn-hero-burgundy"
              onClick={() => onLaunchView('fastmoney')}
            >
              🏆 FAST MONEY
            </button>
          </div>

          <div className="home-secondary-row">
            <button
              type="button"
              className="btn-pill-navy"
              onClick={() => onLaunchView('studio')}
            >
              ⚙ GAME STUDIO
            </button>
            <button type="button" className="btn-pill-navy" onClick={onOpenSettings}>
              🎚 SETTINGS
            </button>
            <button type="button" className="btn-pill-navy" onClick={onOpenHistory}>
              📊 SCORE HISTORY
            </button>
            <button type="button" className="btn-pill-navy" onClick={onOpenHelp}>
              ❓ HELP
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button type="button" className="link-btn" onClick={onOpenOnline}>
              🌐 Manage Online Multiplayer Room &amp; Shareable Links
            </button>
          </div>
        </div>

        <div className="home-join-panel">
          <div className="join-title">JOIN LIVE ONLINE GAME</div>
          <form className="join-form" onSubmit={handleJoinSubmit}>
            <div className="join-row">
              <input
                type="text"
                placeholder="Room Code (e.g. NOEL-4821)"
                maxLength={20}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Your Nickname"
                maxLength={28}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
            <div className="join-row">
              <select
                aria-label="Choose Team or Audience"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              >
                <option value="teamA">Join Team A (Player)</option>
                <option value="teamB">Join Team B (Player)</option>
                <option value="audience">Audience / TV Display</option>
              </select>
              <button type="submit" className="btn-emerald-solid" disabled={joining}>
                {joining ? 'JOINING...' : 'JOIN ROOM'}
              </button>
            </div>
          </form>
          <div className="host-reclaim-row">
            <button type="button" className="link-btn" onClick={onOpenPinSignIn}>
              Administrator / Host PIN Sign-In
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
