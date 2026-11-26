import React, { useEffect, useState } from 'react';

export function ModalFrame({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function StrikeOverlay({ strike }) {
  if (!strike) return null;
  const n = Math.max(1, Math.min(5, Number(strike.count) || 1));
  return (
    <div className="strike-overlay" aria-live="assertive">
      <div className="strike-overlay-content">
        <div className="strike-big-xs">
          {Array.from({ length: n }, (_, i) => (
            <div key={i} className="strike-big-x">
              ✕
            </div>
          ))}
        </div>
        <div className="strike-sub-banner">
          {strike.isMax
            ? `THREE STRIKES ON ${strike.teamName}! OTHER TEAM CAN STEAL!`
            : `STRIKE ${n} — ${strike.teamName}`}
        </div>
      </div>
    </div>
  );
}

export function ToastStack({ toasts }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function TransferConfirmModal({ state, teamKey, onClose, onConfirm }) {
  const tName = state?.teams?.[teamKey]?.name || teamKey;
  const pts = state?.roundPoints || 0;
  return (
    <ModalFrame
      title="Confirm Round Points Transfer"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-mini-navy" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-emerald-solid" onClick={onConfirm}>
            ✓ Confirm Transfer (+{pts})
          </button>
        </>
      }
    >
      <p style={{ fontSize: '1rem', lineHeight: 1.5 }}>
        Award{' '}
        <strong style={{ color: 'var(--gold)', fontSize: '1.25rem' }}>{pts} POINTS</strong> from
        Round {state?.currentRound?.roundNumber || 1} to{' '}
        <strong style={{ color: '#69F0AE' }}>{tName}</strong>?
      </p>
      <p style={{ fontSize: '0.8rem', opacity: 0.82 }}>
        Duplicate-transfer protection prevents awarding the same round bank twice. Undo anytime from
        Score History.
      </p>
    </ModalFrame>
  );
}

export function CustomPointsModal({ state, onClose, onAdjust, onToast }) {
  const [amount, setAmount] = useState('25');
  const [note, setNote] = useState('');
  const teamAName = state?.teams?.teamA?.name || 'TEAM A';
  const teamBName = state?.teams?.teamB?.name || 'TEAM B';

  const apply = (team, op) => {
    const parsed = parseInt(amount, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      onToast('Enter a positive whole number.', 'error');
      return;
    }
    onAdjust(team, op, parsed, note.trim());
  };

  return (
    <ModalFrame
      title="Custom Points Control"
      onClose={onClose}
      footer={
        <button type="button" className="btn-mini-navy" onClick={onClose}>
          Close
        </button>
      }
    >
      <div className="fm-field">
        <label>Custom Point Amount</label>
        <input
          type="number"
          min={1}
          max={100000}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
      </div>
      <div className="fm-field">
        <label>Reason / Note (Optional)</label>
        <input
          type="text"
          placeholder="e.g. Holiday Bonus, Correction, Tiebreaker"
          maxLength={80}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
        <button type="button" className="btn-emerald-solid" onClick={() => apply('teamA', 'add')}>
          + Add to {teamAName}
        </button>
        <button type="button" className="btn-emerald-solid" onClick={() => apply('teamB', 'add')}>
          + Add to {teamBName}
        </button>
        <button
          type="button"
          className="btn-mini-burgundy"
          style={{ padding: 10 }}
          onClick={() => apply('teamA', 'subtract')}
        >
          − Subtract from {teamAName}
        </button>
        <button
          type="button"
          className="btn-mini-burgundy"
          style={{ padding: 10 }}
          onClick={() => apply('teamB', 'subtract')}
        >
          − Subtract from {teamBName}
        </button>
      </div>
    </ModalFrame>
  );
}

export function EditTeamModal({ state, teamKey, onClose, onSave, onToast }) {
  const team = state?.teams?.[teamKey] || { name: '', playerName: '' };
  const [name, setName] = useState(team.name || '');
  const [playerName, setPlayerName] = useState(team.playerName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onToast('Team name cannot be empty.', 'error');
      return;
    }
    onSave(teamKey, { name: name.trim(), playerName: playerName.trim() });
  };

  return (
    <ModalFrame
      title={`Edit ${teamKey === 'teamA' ? 'Team A' : 'Team B'}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-mini-navy" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="editTeamForm" className="btn-gold">
            Save Team Info
          </button>
        </>
      }
    >
      <form id="editTeamForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="fm-field">
          <label>Team Name</label>
          <input type="text" maxLength={36} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="fm-field">
          <label>Captain / Player Name</label>
          <input
            type="text"
            maxLength={36}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>
      </form>
    </ModalFrame>
  );
}

export function ScoreHistoryModal({ state, onClose, onUndo }) {
  const txs = (state?.transactions || []).slice().reverse();
  const canHost = Boolean(state?.canHost || state?.role === 'admin' || state?.role === 'host');

  return (
    <ModalFrame
      title="Score & Transfer Transaction History"
      onClose={onClose}
      footer={
        <>
          {canHost && (
            <button type="button" className="btn-mini-burgundy" onClick={onUndo}>
              ↶ Undo Last Transaction
            </button>
          )}
          <button type="button" className="btn-gold" onClick={onClose}>
            Close
          </button>
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: 10,
          borderRadius: 12,
          background: 'rgba(7,75,52,0.45)',
          border: '1px solid var(--gold)'
        }}
      >
        <div>
          <strong>{state?.teams?.teamA?.name || 'TEAM A'}:</strong> {state?.teams?.teamA?.score ?? 0}{' '}
          pts
        </div>
        <div>
          <strong>{state?.teams?.teamB?.name || 'TEAM B'}:</strong> {state?.teams?.teamB?.score ?? 0}{' '}
          pts
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 320, overflowY: 'auto' }}>
        {txs.length > 0 ? (
          txs.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.28)',
                border: '1px solid var(--gold-soft)',
                opacity: tx.undone ? 0.45 : 1,
                textDecoration: tx.undone ? 'line-through' : 'none'
              }}
            >
              <div>
                <strong style={{ color: 'var(--gold)' }}>{tx.teamName}</strong>
                <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>
                  {' '}
                  — {tx.note} (R{tx.roundNumber || 1})
                </span>
                {tx.undone && (
                  <span style={{ color: '#FF8A95', fontSize: '0.7rem' }}> [UNDONE]</span>
                )}
              </div>
              <strong style={{ color: tx.delta >= 0 ? '#5CF2B1' : '#FF7682' }}>
                {tx.delta >= 0 ? '+' : ''}
                {tx.delta}
              </strong>
            </div>
          ))
        ) : (
          <p style={{ opacity: 0.78, textAlign: 'center' }}>No score transactions recorded yet.</p>
        )}
      </div>
    </ModalFrame>
  );
}

export function OnlineRoomModal({
  state,
  session,
  onClose,
  onToggleLock,
  onKick,
  onLeave,
  onToast
}) {
  if (!state?.roomId) return null;
  const base = `${window.location.origin}${window.location.pathname}`;
  const playerLink = `${base}?room=${encodeURIComponent(state.roomId)}&role=player`;
  const audienceLink = `${base}?room=${encodeURIComponent(state.roomId)}&role=audience`;
  const canHost = Boolean(state.canHost);
  const canAdmin = Boolean(state.canAdmin);

  const copyText = async (val) => {
    try {
      await navigator.clipboard.writeText(val);
    } catch (_) {
      // Fallback ignored if clipboard denied
    }
    onToast('Shareable link copied!', 'success');
  };

  return (
    <ModalFrame
      title={`Live Online Multiplayer Room: ${state.roomId}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-mini-burgundy" onClick={onLeave}>
            Leave Room
          </button>
          <button type="button" className="btn-gold" onClick={onClose}>
            Done
          </button>
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 12,
          background: 'rgba(7,75,52,0.55)',
          border: '1.5px solid var(--gold)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 800 }}>ROOM CODE</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '0.08em' }}>
            {state.roomId}
          </div>
        </div>
        {canAdmin && (
          <div style={{ textAlign: 'right', fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: 'var(--gold)', fontWeight: 800 }}>ADMIN PIN:</span>{' '}
              <strong>{session?.adminPin || '••••••'}</strong>
            </div>
            <div>
              <span style={{ color: '#AED4FF', fontWeight: 800 }}>CO-HOST PIN:</span>{' '}
              <strong>{session?.hostPin || '••••••'}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="fm-field">
        <label>Shareable Player Join Link (Team A / Team B — Zero Answer Keys Exposed)</label>
        <div className="copy-link-row">
          <input type="text" readOnly value={playerLink} />
          <button type="button" className="btn-gold" onClick={() => copyText(playerLink)}>
            Copy
          </button>
        </div>
      </div>

      <div className="fm-field">
        <label>Audience / Big-Screen TV Display Link (Public Board Only)</label>
        <div className="copy-link-row">
          <input type="text" readOnly value={audienceLink} />
          <button type="button" className="btn-mini-emerald" onClick={() => copyText(audienceLink)}>
            Copy
          </button>
        </div>
      </div>

      {canHost && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: 10,
            background: 'rgba(92,12,24,0.65)',
            border: '1px solid var(--gold-soft)'
          }}
        >
          <span>
            <strong>Room Lock:</strong> {state.locked ? '🔒 Locked' : '🔓 Open for Players'}
          </span>
          <button type="button" className="btn-mini-gold" onClick={() => onToggleLock(!state.locked)}>
            {state.locked ? 'Unlock Room' : 'Lock Room'}
          </button>
        </div>
      )}

      <div>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--gold)', marginBottom: 6 }}>
          CONNECTED PARTICIPANTS ({(state.participants || []).length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
          {(state.participants || []).length > 0 ? (
            state.participants.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 10px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.28)',
                  border: '1px solid var(--gold-soft)'
                }}
              >
                <div>
                  {p.connected ? '🟢' : '⚪'} <strong>{p.name}</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--gold)', marginLeft: 6 }}>
                    {p.team.toUpperCase()}
                  </span>
                </div>
                {canHost && (
                  <button
                    type="button"
                    className="btn-mini-burgundy"
                    onClick={() => onKick(p.id)}
                  >
                    Kick
                  </button>
                )}
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.8rem', opacity: 0.75 }}>
              No players connected yet — share the Player Join Link below!
            </p>
          )}
        </div>
      </div>
    </ModalFrame>
  );
}

export function SettingsModal({
  state,
  quality,
  musicMuted,
  sfxMuted,
  onChangeQuality,
  onToggleMusic,
  onToggleSfx,
  onChangeEdition,
  onClose
}) {
  const canHost = Boolean(state?.canHost);
  return (
    <ModalFrame
      title="Show Settings, Audio & 3D Performance"
      onClose={onClose}
      footer={
        <button type="button" className="btn-gold" onClick={onClose}>
          Save &amp; Close
        </button>
      }
    >
      <div className="fm-field">
        <label>3D Visual Quality &amp; Resolution Mode</label>
        <select value={quality} onChange={(e) => onChangeQuality(e.target.value)}>
          <option value="ultra">Ultra 3D PBR (4K/8K Sharp, Shadows &amp; High Particles)</option>
          <option value="balanced">Balanced 3D (Optimized for Laptops, Tablets &amp; Mobile)</option>
          <option value="lite">Lite Fallback Mode (2D Animated Canvas for Legacy Devices)</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          type="button"
          className="btn-mini-emerald"
          style={{ padding: 10 }}
          onClick={onToggleMusic}
        >
          🎵 Music: {musicMuted ? 'MUTED' : 'ON'}
        </button>
        <button
          type="button"
          className="btn-mini-burgundy"
          style={{ padding: 10 }}
          onClick={onToggleSfx}
        >
          🔊 Sound FX: {sfxMuted ? 'MUTED' : 'ON'}
        </button>
      </div>

      {canHost && state && (
        <div className="fm-field" style={{ marginTop: 8 }}>
          <label>Switch Game Edition (Preserves all saved edition banks)</label>
          <select value={state.edition} onChange={(e) => onChangeEdition(e.target.value)}>
            <option value="classic">70 ROUNDS – CLASSIC EDITION</option>
            <option value="deluxe">100 ROUNDS – DELUXE EDITION</option>
            <option value="ultimate">150 ROUNDS – ULTIMATE EDITION</option>
          </select>
        </div>
      )}
    </ModalFrame>
  );
}

export function HelpModal({ onClose }) {
  return (
    <ModalFrame
      title="CHRISTMAS FEUD — Host & Player Guide"
      onClose={onClose}
      footer={
        <button type="button" className="btn-gold" onClick={onClose}>
          Got It!
        </button>
      }
    >
      <div style={{ fontSize: '0.86rem', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p>
          <strong style={{ color: 'var(--gold)' }}>1. Main Two-Team Christmas FEUD:</strong> Play
          across 15 all-Christmas categories (70 Classic / 100 Deluxe / 150 Ultimate rounds). The
          Host reveals answers individually or all at once, can hide answers, issues up to 3 strikes
          per team, and awards Round Points to Team A or Team B with duplicate-transfer protection
          and Undo.
        </p>
        <p>
          <strong style={{ color: 'var(--gold)' }}>
            2. Private Fast Money Finale (Zero Live Answer Reveals):
          </strong>{' '}
          Player 1 and Player 2 answer timed questions privately. No answer keys, accepted answers,
          or automatic matching ever appear in live Fast Money! After both players finish, the Host
          scores each response manually using the private Administrator PDF Answer Key or protected
          Studio dashboard, enters optional manual bonus points, and publishes the final result.
        </p>
        <p>
          <strong style={{ color: 'var(--gold)' }}>
            3. Printable Administrator Answer-Key PDFs:
          </strong>{' '}
          Open <strong>Game Studio → PDF Keys</strong> to download separate private PDFs for
          70-Round, 100-Round, 150-Round, and Fast Money banks using your latest saved edits.
        </p>
        <p style={{ fontSize: '0.78rem', opacity: 0.8 }}>
          <em>
            Note: All sample survey point values are illustrative game-show entertainment data
            (summing to 100 per standard round), not verified statistical survey research.
          </em>
        </p>
      </div>
    </ModalFrame>
  );
}

export function PinSignInModal({ defaultRoomId, onClose, onSubmit, onToast }) {
  const [roomId, setRoomId] = useState(defaultRoomId || '');
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim() || !pin.trim()) {
      onToast('Enter Room Code and PIN.', 'error');
      return;
    }
    onSubmit(roomId.trim().toUpperCase(), pin.trim());
  };

  return (
    <ModalFrame
      title="Administrator / Co-Host PIN Sign-In"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-mini-navy" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="pinSignInForm" className="btn-gold">
            Sign In
          </button>
        </>
      }
    >
      <form id="pinSignInForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="fm-field">
          <label>Room Code</label>
          <input
            type="text"
            placeholder="e.g. NOEL-4821"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            autoFocus
          />
        </div>
        <div className="fm-field">
          <label>6-Digit Admin PIN or Co-Host PIN</label>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </div>
      </form>
    </ModalFrame>
  );
}

export function ShareJoinModal({ roomId, onClose, onJoin, onToast }) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('teamA');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onToast('Please enter your nickname.', 'error');
      return;
    }
    onJoin(roomId, { name: name.trim(), team });
  };

  return (
    <ModalFrame
      title={`Join Live CHRISTMAS FEUD Room ${roomId}`}
      onClose={onClose}
      footer={
        <button type="submit" form="shareJoinForm" className="btn-emerald-solid">
          🎄 JOIN GAME
        </button>
      }
    >
      <form id="shareJoinForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="fm-field">
          <label>Your Nickname</label>
          <input
            type="text"
            placeholder="Enter display name"
            maxLength={28}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="fm-field">
          <label>Choose Team</label>
          <select value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="teamA">Team A (Player)</option>
            <option value="teamB">Team B (Player)</option>
            <option value="audience">Audience / TV Display</option>
          </select>
        </div>
      </form>
    </ModalFrame>
  );
}

export function ConfirmModal({ title, message, confirmLabel, confirmClass, onClose, onConfirm }) {
  return (
    <ModalFrame
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-mini-navy" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={confirmClass || 'btn-gold'}
            onClick={async () => {
              await onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel || 'Confirm'}
          </button>
        </>
      }
    >
      <p style={{ lineHeight: 1.5 }}>{message}</p>
    </ModalFrame>
  );
}
