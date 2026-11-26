import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './services/api.js';
import { audio } from './services/audio.js';
import Stage3D from './components/Stage3D.jsx';
import TopBar from './components/TopBar.jsx';
import HomeView from './components/HomeView.jsx';
import MainBoardView from './components/MainBoardView.jsx';
import FastMoneyView from './components/FastMoneyView.jsx';
import WinnerView from './components/WinnerView.jsx';
import GameStudioView from './components/GameStudioView.jsx';
import {
  StrikeOverlay,
  ToastStack,
  TransferConfirmModal,
  CustomPointsModal,
  EditTeamModal,
  ScoreHistoryModal,
  OnlineRoomModal,
  SettingsModal,
  HelpModal,
  PinSignInModal,
  ShareJoinModal,
  ConfirmModal
} from './components/Modals.jsx';

function detectInitialQuality() {
  try {
    const saved = localStorage.getItem('cff_quality');
    if (saved && ['ultra', 'balanced', 'lite'].includes(saved)) return saved;
  } catch (_) {}
  return typeof window !== 'undefined' && window.innerWidth < 768 ? 'balanced' : 'ultra';
}

export default function App() {
  const stageRef = useRef(null);
  const lastEventsRef = useRef({
    revealAt: 0,
    strikeAt: 0,
    buzzAt: 0,
    txCount: 0,
    celebrationNonce: 0,
    fmCelebrationNonce: 0
  });
  const strikeTimerRef = useRef(null);

  const [appState, setAppState] = useState(null);
  const [localView, setLocalView] = useState('home');
  const [selectedEdition, setSelectedEdition] = useState('classic');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [quality, setQuality] = useState(detectInitialQuality);
  const [fallback2D, setFallback2D] = useState(false);
  const [musicMuted, setMusicMuted] = useState(() => audio.musicMuted);
  const [sfxMuted, setSfxMuted] = useState(() => audio.sfxMuted);
  const [strikeOverlay, setStrikeOverlay] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [urlRoomPrefill, setUrlRoomPrefill] = useState('');

  const showToast = useCallback((message, type = 'info', duration = 3400) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const onActionError = useCallback(
    (err) => showToast(err?.message || 'Action failed.', 'error'),
    [showToast]
  );

  const triggerStrikeBanner = useCallback((count, isMax, teamName) => {
    setStrikeOverlay({ count, isMax, teamName });
    if (strikeTimerRef.current) clearTimeout(strikeTimerRef.current);
    strikeTimerRef.current = setTimeout(() => {
      setStrikeOverlay(null);
    }, isMax ? 2400 : 1450);
  }, []);

  const applyIncomingState = useCallback(
    (state, isInitial = false) => {
      if (!state) return;
      setAppState(state);
      if (state.edition) setSelectedEdition(state.edition);

      const ev = lastEventsRef.current;
      if (!isInitial) {
        if (state.revealEvent?.at && state.revealEvent.at > ev.revealAt) {
          ev.revealAt = state.revealEvent.at;
          audio.playReveal();
          stageRef.current?.triggerRevealBurst();
        }
        if (state.strikeEvent?.at && state.strikeEvent.at > ev.strikeAt) {
          ev.strikeAt = state.strikeEvent.at;
          audio.playStrike(state.strikeEvent.isMax);
          stageRef.current?.triggerStrikeFlash(state.strikeEvent.isMax);
          triggerStrikeBanner(
            state.strikeEvent.count,
            state.strikeEvent.isMax,
            state.strikeEvent.teamName
          );
        }
        if (state.lastBuzz?.at && state.lastBuzz.at > ev.buzzAt) {
          ev.buzzAt = state.lastBuzz.at;
          audio.playBuzz(state.lastBuzz.team);
        }
        if ((state.transactions?.length || 0) > ev.txCount) {
          ev.txCount = state.transactions.length;
          audio.playScoreTransfer();
        }
        if ((state.winnerSummary?.celebrationNonce || 0) > ev.celebrationNonce) {
          ev.celebrationNonce = state.winnerSummary.celebrationNonce;
          audio.playWinnerFanfare();
          stageRef.current?.triggerCelebration(12);
        }
        if ((state.fastMoney?.celebrationNonce || 0) > ev.fmCelebrationNonce) {
          ev.fmCelebrationNonce = state.fastMoney.celebrationNonce;
          if (state.fastMoney?.result?.won) {
            audio.playWinnerFanfare();
            stageRef.current?.triggerCelebration(10);
          } else {
            audio.playIncorrect();
          }
        }
      } else {
        ev.revealAt = state.revealEvent?.at || 0;
        ev.strikeAt = state.strikeEvent?.at || 0;
        ev.buzzAt = state.lastBuzz?.at || 0;
        ev.txCount = state.transactions?.length || 0;
        ev.celebrationNonce = state.winnerSummary?.celebrationNonce || 0;
        ev.fmCelebrationNonce = state.fastMoney?.celebrationNonce || 0;
      }

      const effective =
        state.role !== 'admin' && state.view === 'studio' ? 'game' : state.view || 'home';
      setLocalView(effective);
    },
    [triggerStrikeBanner]
  );

  const connectLiveStream = useCallback(() => {
    api.connectStream({
      onState: (snap) => applyIncomingState(snap, false),
      onConnection: (status) => setConnectionStatus(status),
      onKicked: () => {
        showToast('You were removed from the room by the Host.', 'error', 5000);
        setAppState(null);
        setLocalView('home');
      }
    });
  }, [applyIncomingState, showToast]);

  // Keep body classes synced for CSS 4-role visibility & 2D fallback rules
  useEffect(() => {
    const role = appState?.role || 'admin';
    document.body.classList.remove('role-admin', 'role-host', 'role-player', 'role-audience');
    document.body.classList.add(`role-${role}`);
  }, [appState?.role]);

  useEffect(() => {
    document.body.classList.remove(
      'mode-home',
      'mode-game',
      'mode-fastmoney',
      'mode-winner',
      'mode-studio'
    );
    document.body.classList.add(`mode-${localView}`);
  }, [localView]);

  useEffect(() => {
    document.body.classList.toggle('fallback-2d', fallback2D);
  }, [fallback2D]);

  // Bootstrap URL ?room=&role= or existing localStorage session on mount
  useEffect(() => {
    let active = true;
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room')?.trim().toUpperCase();
      const urlRole = params.get('role')?.trim().toLowerCase();

      if (urlRoom && urlRole === 'audience') {
        try {
          const res = await api.joinRoom(urlRoom, { name: 'Audience TV', team: 'audience' });
          if (!active) return;
          applyIncomingState(res.snapshot, true);
          connectLiveStream();
          return;
        } catch (err) {
          if (active) showToast(err.message, 'error', 5000);
        }
      }

      if (urlRoom && urlRole === 'player') {
        if (
          api.session?.roomId === urlRoom &&
          api.session?.participantId &&
          api.session?.role === 'player'
        ) {
          try {
            const res = await api.joinRoom(urlRoom, {
              name: api.session.name,
              team: api.session.team
            });
            if (!active) return;
            applyIncomingState(res.snapshot, true);
            connectLiveStream();
            showToast(`Reconnected to Room ${urlRoom}!`, 'success');
            return;
          } catch (_) {}
        }
        if (active) {
          setUrlRoomPrefill(urlRoom);
          setModal({ type: 'shareJoin', roomId: urlRoom });
        }
        return;
      }

      if (api.session?.roomId) {
        try {
          const snap = await api.fetchState(api.session.roomId);
          if (!active) return;
          applyIncomingState(snap, true);
          connectLiveStream();
          return;
        } catch (_) {
          api.clearSession();
        }
      }
    };

    init();
    return () => {
      active = false;
      api.disconnectStream();
      if (strikeTimerRef.current) clearTimeout(strikeTimerRef.current);
    };
  }, [applyIncomingState, connectLiveStream, showToast]);

  // --- Navigation & Room Creation ---
  const ensureHostRoom = useCallback(
    async (targetView = 'game') => {
      try {
        if (appState && (appState.canHost || appState.canAdmin)) {
          if (targetView === 'studio' && !appState.canAdmin) {
            showToast('Administrator privileges are required to open Game Studio.', 'error');
            return appState;
          }
          if (appState.edition !== selectedEdition) {
            await api.setEdition(selectedEdition);
          }
          await api.setView(targetView);
          return appState;
        }
        const created = await api.createRoom({ edition: selectedEdition });
        applyIncomingState(created.snapshot, true);
        connectLiveStream();
        await api.setView(targetView);
        showToast(`Live Room ${created.roomId} created! Share links under ONLINE.`, 'success', 4500);
        return created.snapshot;
      } catch (err) {
        onActionError(err);
        return null;
      }
    },
    [appState, selectedEdition, applyIncomingState, connectLiveStream, showToast, onActionError]
  );

  const handleNavigate = useCallback(
    (target) => {
      if (appState?.canHost) {
        if (target === 'studio' && !appState.canAdmin) {
          showToast('Administrator privileges are required to open Game Studio.', 'error');
          return;
        }
        api.setView(target).catch(onActionError);
      } else {
        setLocalView(target);
      }
    },
    [appState, onActionError, showToast]
  );

  const handleSelectHomeEdition = useCallback(
    (ed) => {
      setSelectedEdition(ed);
      if (appState?.canHost) {
        api.setEdition(ed).catch(onActionError);
      }
    },
    [appState, onActionError]
  );

  const handleJoinRoom = useCallback(
    async (roomId, { name, team }) => {
      try {
        const res = await api.joinRoom(roomId, { name, team });
        setModal(null);
        applyIncomingState(res.snapshot, true);
        connectLiveStream();
        showToast(`Welcome ${name}! Connected live to ${roomId}.`, 'success');
      } catch (err) {
        onActionError(err);
      }
    },
    [applyIncomingState, connectLiveStream, showToast, onActionError]
  );

  const handlePinSignIn = useCallback(
    async (roomId, pin) => {
      try {
        const res = await api.pinAuth(roomId, pin);
        setModal(null);
        applyIncomingState(res.snapshot, true);
        connectLiveStream();
        showToast(`Signed in as ${res.role.toUpperCase()} for ${roomId}!`, 'success');
      } catch (err) {
        onActionError(err);
      }
    },
    [applyIncomingState, connectLiveStream, showToast, onActionError]
  );

  // --- Utility Toggles ---
  const handleToggleMusic = useCallback(() => {
    const isOn = audio.toggleMusic();
    setMusicMuted(!isOn);
  }, []);

  const handleToggleSfx = useCallback(() => {
    const isOn = audio.toggleSfx();
    setSfxMuted(!isOn);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }, []);

  const handleChangeQuality = useCallback(
    (q) => {
      setQuality(q);
      stageRef.current?.setQuality(q);
      showToast(`Visual mode set to ${q.toUpperCase()}`, 'success');
    },
    [showToast]
  );

  const handleOpenOnline = useCallback(async () => {
    if (!appState) {
      const created = await ensureHostRoom('game');
      if (created) setModal({ type: 'online' });
      return;
    }
    setModal({ type: 'online' });
  }, [appState, ensureHostRoom]);

  // --- Main Board Action Handlers ---
  const handleRevealNext = useCallback(() => {
    const slots = appState?.currentRound?.slots || [];
    const nextIdx = slots.findIndex((s) => !s.revealed);
    if (nextIdx === -1) {
      showToast('All 8 answers are already revealed!', 'info');
      return;
    }
    api.revealSlot(nextIdx).catch(onActionError);
  }, [appState, showToast, onActionError]);

  const handleRequestTransfer = useCallback(
    (teamKey) => {
      if (appState?.roundPointsTransferred) {
        showToast(
          'Round points were already transferred! Undo last transaction or reset round first.',
          'error'
        );
        return;
      }
      if ((appState?.roundPoints || 0) <= 0) {
        showToast('Reveal at least one answer before transferring round points.', 'error');
        return;
      }
      setModal({ type: 'transfer', teamKey });
    },
    [appState, showToast]
  );

  const handleTriggerCelebration = useCallback((secs) => {
    stageRef.current?.triggerCelebration(secs);
  }, []);

  return (
    <>
      <Stage3D
        ref={stageRef}
        mode={localView}
        quality={quality}
        onFallbackChange={setFallback2D}
      />

      <StrikeOverlay strike={strikeOverlay} />
      <ToastStack toasts={toasts} />

      <div id="appShell" className="app-shell">
        <TopBar
          state={appState}
          activeView={localView}
          connectionStatus={connectionStatus}
          musicMuted={musicMuted}
          sfxMuted={sfxMuted}
          onNavigate={handleNavigate}
          onToggleMusic={handleToggleMusic}
          onToggleSfx={handleToggleSfx}
          onOpenOnline={handleOpenOnline}
          onOpenHistory={() => setModal({ type: 'history' })}
          onOpenHelp={() => setModal({ type: 'help' })}
          onOpenSettings={() => setModal({ type: 'settings' })}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {localView === 'home' && (
          <HomeView
            selectedEdition={selectedEdition}
            onSelectEdition={handleSelectHomeEdition}
            onLaunchView={ensureHostRoom}
            onOpenOnline={handleOpenOnline}
            onOpenSettings={() => setModal({ type: 'settings' })}
            onOpenHistory={() => setModal({ type: 'history' })}
            onOpenHelp={() => setModal({ type: 'help' })}
            onOpenPinSignIn={() => setModal({ type: 'pinSignIn' })}
            onJoinRoom={handleJoinRoom}
            musicMuted={musicMuted}
            sfxMuted={sfxMuted}
            onToggleMusic={handleToggleMusic}
            onToggleSfx={handleToggleSfx}
            onToggleFullscreen={handleToggleFullscreen}
            initialRoomCode={urlRoomPrefill}
          />
        )}

        {localView === 'game' && (
          <MainBoardView
            state={appState}
            onClearBuzz={() => api.clearBuzz().catch(onActionError)}
            onEditTeam={(teamKey) => setModal({ type: 'editTeam', teamKey })}
            onQuickScore={(teamKey, op) => {
              const step = appState?.settings?.quickPointsStep || 10;
              api.adjustScore(teamKey, op, step, 'Quick score adjustment').catch(onActionError);
            }}
            onOpenCustom={(teamKey) => setModal({ type: 'customPoints', teamKey })}
            onAddStrike={(teamKey) => api.addStrike(teamKey).catch(onActionError)}
            onResetStrikes={(teamKey) => api.resetStrikes(teamKey).catch(onActionError)}
            onRevealSlot={(idx) => api.revealSlot(idx).catch(onActionError)}
            onRevealNext={handleRevealNext}
            onRevealAll={() => api.revealAll().catch(onActionError)}
            onHideAnswers={() =>
              api
                .hideAnswers()
                .then(() => showToast('Answers hidden back to numbered slots.', 'info'))
                .catch(onActionError)
            }
            onPrevRound={() => api.roundAction({ action: 'prev' }).catch(onActionError)}
            onNextRound={() => api.roundAction({ action: 'next' }).catch(onActionError)}
            onResetRound={() =>
              api
                .roundAction({ action: 'reset' })
                .then(() => showToast('Round reset!', 'info'))
                .catch(onActionError)
            }
            onTransferTeam={handleRequestTransfer}
            onUndo={() =>
              api
                .undoLast()
                .then(() => showToast('Last transaction undone!', 'success'))
                .catch(onActionError)
            }
            onNavigate={handleNavigate}
            onPlayerBuzz={async () => {
              try {
                const res = await api.buzz();
                showToast(
                  res.accepted ? '🔔 You buzzed in!' : 'Someone buzzed just ahead of you!',
                  res.accepted ? 'success' : 'info'
                );
              } catch (err) {
                onActionError(err);
              }
            }}
          />
        )}

        {localView === 'fastmoney' && (
          <FastMoneyView
            state={appState}
            api={api}
            onToast={showToast}
            onActionError={onActionError}
            onTriggerCelebration={handleTriggerCelebration}
          />
        )}

        {localView === 'winner' && (
          <WinnerView
            state={appState}
            onWinnerAction={(body) => api.winnerAction(body).catch(onActionError)}
            onNavigate={handleNavigate}
            onNewGame={() =>
              setModal({
                type: 'confirm',
                title: 'Start a Brand-New Game',
                message:
                  'Scores & round progress reset to zero while all saved question banks remain preserved.',
                confirmLabel: '✨ Start New Game',
                confirmClass: 'btn-emerald-solid',
                onConfirm: () => api.winnerAction({ action: 'new-game' }).catch(onActionError)
              })
            }
          />
        )}

        {localView === 'studio' && appState?.role === 'admin' && (
          <GameStudioView
            api={api}
            onClose={() => api.setView('game').catch(onActionError)}
            onToast={showToast}
            onActionError={onActionError}
            onRequestConfirm={(cfg) => setModal({ type: 'confirm', ...cfg })}
          />
        )}
      </div>

      {/* MODALS */}
      {modal?.type === 'transfer' && (
        <TransferConfirmModal
          state={appState}
          teamKey={modal.teamKey}
          onClose={() => setModal(null)}
          onConfirm={async () => {
            try {
              const tName = appState?.teams?.[modal.teamKey]?.name || modal.teamKey;
              const pts = appState?.roundPoints || 0;
              await api.transferPoints(modal.teamKey);
              setModal(null);
              showToast(`Transferred ${pts} points to ${tName}!`, 'success');
            } catch (err) {
              onActionError(err);
            }
          }}
        />
      )}

      {modal?.type === 'customPoints' && (
        <CustomPointsModal
          state={appState}
          onClose={() => setModal(null)}
          onToast={showToast}
          onAdjust={async (team, op, amount, note) => {
            try {
              await api.adjustScore(team, op, amount, note);
              setModal(null);
              showToast(
                `${op === 'add' ? 'Added' : 'Subtracted'} ${amount} pts (${
                  appState?.teams?.[team]?.name || team
                })`,
                'success'
              );
            } catch (err) {
              onActionError(err);
            }
          }}
        />
      )}

      {modal?.type === 'editTeam' && (
        <EditTeamModal
          state={appState}
          teamKey={modal.teamKey}
          onClose={() => setModal(null)}
          onToast={showToast}
          onSave={async (teamKey, info) => {
            try {
              await api.updateTeams({ [teamKey]: info });
              setModal(null);
              showToast('Team updated across all screens!', 'success');
            } catch (err) {
              onActionError(err);
            }
          }}
        />
      )}

      {modal?.type === 'history' && (
        <ScoreHistoryModal
          state={appState}
          onClose={() => setModal(null)}
          onUndo={async () => {
            try {
              await api.undoLast();
              setModal(null);
              showToast('Last score transaction undone!', 'success');
            } catch (err) {
              onActionError(err);
            }
          }}
        />
      )}

      {modal?.type === 'online' && (
        <OnlineRoomModal
          state={appState}
          session={api.session}
          onClose={() => setModal(null)}
          onToast={showToast}
          onToggleLock={async (locked) => {
            try {
              await api.setRoomLock(locked);
              setModal(null);
              showToast('Room lock updated!', 'success');
            } catch (err) {
              onActionError(err);
            }
          }}
          onKick={async (participantId) => {
            try {
              await api.kickParticipant(participantId);
              setModal(null);
              showToast('Participant removed.', 'info');
            } catch (err) {
              onActionError(err);
            }
          }}
          onLeave={() => {
            api.clearSession();
            setModal(null);
            setAppState(null);
            setLocalView('home');
            window.history.replaceState({}, '', window.location.pathname);
          }}
        />
      )}

      {modal?.type === 'settings' && (
        <SettingsModal
          state={appState}
          quality={quality}
          musicMuted={musicMuted}
          sfxMuted={sfxMuted}
          onChangeQuality={handleChangeQuality}
          onToggleMusic={handleToggleMusic}
          onToggleSfx={handleToggleSfx}
          onChangeEdition={async (ed) => {
            try {
              await api.setEdition(ed);
              showToast(`Switched to ${ed.toUpperCase()} Edition!`, 'success');
            } catch (err) {
              onActionError(err);
            }
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'help' && <HelpModal onClose={() => setModal(null)} />}

      {modal?.type === 'pinSignIn' && (
        <PinSignInModal
          defaultRoomId={appState?.roomId || ''}
          onClose={() => setModal(null)}
          onToast={showToast}
          onSubmit={handlePinSignIn}
        />
      )}

      {modal?.type === 'shareJoin' && (
        <ShareJoinModal
          roomId={modal.roomId}
          onClose={() => setModal(null)}
          onToast={showToast}
          onJoin={handleJoinRoom}
        />
      )}

      {modal?.type === 'confirm' && (
        <ConfirmModal
          title={modal.title}
          message={modal.message}
          confirmLabel={modal.confirmLabel}
          confirmClass={modal.confirmClass}
          onClose={() => setModal(null)}
          onConfirm={modal.onConfirm}
        />
      )}
    </>
  );
}
