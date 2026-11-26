/**
 * CHRISTMAS FEUD (REACT) — REAL-TIME MULTIPLAYER API, 4-ROLE RBAC & PDF DOWNLOAD CLIENT
 */

const SESSION_KEY = 'cff_session_v2';

export class FeudApiClient {
  constructor() {
    this.session = this.loadSession();
    this.eventSource = null;
    this.pollTimer = null;
    this.onStateCallback = null;
    this.onConnectionCallback = null;
    this.onKickedCallback = null;
  }

  loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY) || localStorage.getItem('cff_session_v1');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  saveSession(data) {
    this.session = data;
    try {
      if (data) localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      else {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('cff_session_v1');
      }
    } catch (_) {}
  }

  clearSession() {
    this.disconnectStream();
    this.saveSession(null);
  }

  getHeaders(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra };
    if (this.session?.adminToken) h['X-Admin-Token'] = this.session.adminToken;
    if (this.session?.hostToken) h['X-Host-Token'] = this.session.hostToken;
    if (this.session?.participantId) h['X-Participant-Id'] = this.session.participantId;
    if (this.session?.participantToken) h['X-Participant-Token'] = this.session.participantToken;
    return h;
  }

  async request(url, { method = 'GET', body = null } = {}) {
    const opts = { method, headers: this.getHeaders() };
    if (body !== null) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    if (method !== 'GET' && data && data.snapshot && this.onStateCallback) {
      try {
        this.onStateCallback(data.snapshot);
      } catch (_) {}
    }
    return data;
  }

  async createRoom(options = {}) {
    const res = await this.request('/api/rooms', { method: 'POST', body: options });
    this.saveSession({
      roomId: res.roomId,
      role: 'admin',
      adminToken: res.adminToken,
      adminPin: res.adminPin,
      hostToken: res.hostToken,
      hostPin: res.hostPin
    });
    return res;
  }

  async pinAuth(roomId, pin) {
    const res = await this.request(`/api/rooms/${encodeURIComponent(roomId)}/host-auth`, {
      method: 'POST',
      body: { pin }
    });
    this.saveSession({
      roomId: res.roomId,
      role: res.role,
      adminToken: res.adminToken || null,
      adminPin: res.role === 'admin' ? pin : null,
      hostToken: res.hostToken,
      hostPin: res.role === 'host' ? pin : null
    });
    return res;
  }

  async joinRoom(roomId, { name, team }) {
    const payload = { name, team };
    if (this.session && this.session.roomId === roomId.toUpperCase() && this.session.participantId) {
      payload.participantId = this.session.participantId;
      payload.participantToken = this.session.participantToken;
    }
    const res = await this.request(`/api/rooms/${encodeURIComponent(roomId)}/join`, {
      method: 'POST',
      body: payload
    });
    this.saveSession({
      roomId: roomId.toUpperCase(),
      role: res.participant.role,
      team: res.participant.team,
      name: res.participant.name,
      participantId: res.participant.id,
      participantToken: res.participant.token
    });
    return res;
  }

  async fetchState(roomId = null) {
    const rid = (roomId || this.session?.roomId || '').toUpperCase();
    if (!rid) throw new Error('No active room.');
    if ((this.session?.role === 'admin' || this.session?.role === 'host') && (this.session?.adminToken || this.session?.hostToken)) {
      return this.request(`/api/rooms/${encodeURIComponent(rid)}/host-state`);
    }
    return this.request(`/api/rooms/${encodeURIComponent(rid)}/public-state`);
  }

  connectStream({ onState, onConnection, onKicked }) {
    this.onStateCallback = onState;
    this.onConnectionCallback = onConnection;
    this.onKickedCallback = onKicked;
    this.disconnectStream();

    if (!this.session?.roomId) return;
    const rid = encodeURIComponent(this.session.roomId);
    const params = new URLSearchParams();
    params.set('role', this.session.role || 'audience');
    if (this.session.role === 'admin' && this.session.adminToken) {
      params.set('adminToken', this.session.adminToken);
    } else if (this.session.role === 'host' && this.session.hostToken) {
      params.set('hostToken', this.session.hostToken);
    } else if (this.session.participantId) {
      params.set('participantId', this.session.participantId);
      if (this.session.participantToken) params.set('participantToken', this.session.participantToken);
    }

    const es = new EventSource(`/api/rooms/${rid}/stream?${params.toString()}`);
    this.eventSource = es;

    es.onopen = () => {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
      if (this.onConnectionCallback) this.onConnectionCallback('connected');
    };
    es.addEventListener('state', (ev) => {
      try {
        if (this.onStateCallback) this.onStateCallback(JSON.parse(ev.data));
      } catch (_) {}
    });
    es.addEventListener('kicked', (ev) => {
      this.disconnectStream();
      this.clearSession();
      if (this.onKickedCallback) this.onKickedCallback(ev.data);
    });
    es.onerror = () => {
      if (this.onConnectionCallback) this.onConnectionCallback('reconnecting');
      if (!this.pollTimer && this.session?.roomId) {
        this.pollTimer = setInterval(() => {
          this.fetchState()
            .then((snap) => {
              if (this.onStateCallback) this.onStateCallback(snap);
            })
            .catch(() => {});
        }, 2500);
      }
    };
  }

  disconnectStream() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  roomUrl(path) {
    return `/api/rooms/${encodeURIComponent(this.session.roomId)}/${path}`;
  }

  // --- Standard FEUD Controls ---
  setView(view) { return this.request(this.roomUrl('view'), { method: 'POST', body: { view } }); }
  setEdition(edition) { return this.request(this.roomUrl('edition'), { method: 'POST', body: { edition } }); }
  roundAction(body) { return this.request(this.roomUrl('round'), { method: 'POST', body }); }
  hideAnswers() { return this.roundAction({ action: 'hide-answers' }); }
  revealSlot(slotIndex) { return this.request(this.roomUrl('reveal'), { method: 'POST', body: { slotIndex } }); }
  revealAll() { return this.request(this.roomUrl('reveal'), { method: 'POST', body: { all: true } }); }
  transferPoints(team) { return this.request(this.roomUrl('transfer'), { method: 'POST', body: { team } }); }
  undoLast() { return this.request(this.roomUrl('undo'), { method: 'POST', body: {} }); }
  adjustScore(team, operation, amount, note) {
    return this.request(this.roomUrl('score'), { method: 'POST', body: { team, operation, amount, note } });
  }
  addStrike(team) { return this.request(this.roomUrl('strike'), { method: 'POST', body: { team } }); }
  resetStrikes(team = 'both') { return this.request(this.roomUrl('strike'), { method: 'POST', body: { action: 'reset', team } }); }
  updateTeams(payload) { return this.request(this.roomUrl('teams'), { method: 'PUT', body: payload }); }
  winnerAction(body) { return this.request(this.roomUrl('winner'), { method: 'POST', body }); }
  buzz(body = {}) { return this.request(this.roomUrl('buzz'), { method: 'POST', body }); }
  clearBuzz() { return this.request(this.roomUrl('clear-buzz'), { method: 'POST', body: {} }); }
  submitGuess(text) { return this.request(this.roomUrl('guess'), { method: 'POST', body: { text } }); }
  setRoomLock(locked) { return this.request(this.roomUrl('lock'), { method: 'POST', body: { locked } }); }
  kickParticipant(participantId) { return this.request(this.roomUrl('kick'), { method: 'POST', body: { participantId } }); }

  // --- Fast Money Controls (Zero live answer reveals, zero auto-matching!) ---
  fmConfig(cfg) { return this.request(this.roomUrl('fast-money/config'), { method: 'POST', body: cfg }); }
  fmStart(config = null) { return this.request(this.roomUrl('fast-money/start'), { method: 'POST', body: { config } }); }
  fmSubmit(playerNum, answerText, questionIndex = null) {
    return this.request(this.roomUrl('fast-money/submit'), { method: 'POST', body: { playerNum, answerText, questionIndex } });
  }
  fmSkip(playerNum = null) { return this.request(this.roomUrl('fast-money/skip'), { method: 'POST', body: { playerNum } }); }
  fmLockTurn(playerNum) { return this.request(this.roomUrl('fast-money/lock-turn'), { method: 'POST', body: { playerNum } }); }
  fmStartP2() { return this.request(this.roomUrl('fast-money/start-p2'), { method: 'POST', body: {} }); }
  fmTimer(action, seconds = 0) { return this.request(this.roomUrl('fast-money/timer'), { method: 'POST', body: { action, seconds } }); }
  fmManualScore(payload) { return this.request(this.roomUrl('fast-money/manual-score'), { method: 'POST', body: payload }); }
  fmManualBonus(bonusPoints) { return this.request(this.roomUrl('fast-money/manual-bonus'), { method: 'POST', body: { bonusPoints } }); }
  fmPublishResult() { return this.request(this.roomUrl('fast-money/publish-result'), { method: 'POST', body: {} }); }
  fmReset() { return this.request(this.roomUrl('fast-money/reset'), { method: 'POST', body: {} }); }

  // --- Administrator-Only Game Studio & Private PDF Answer Keys ---
  getStudio() { return this.request(this.roomUrl('studio')); }
  studioSaveStandard(edition, index, round) {
    return this.request(this.roomUrl('studio/standard/save'), { method: 'POST', body: { edition, index, round } });
  }
  studioDeleteStandard(edition, index) {
    return this.request(this.roomUrl('studio/standard/delete'), { method: 'POST', body: { edition, index } });
  }
  studioDuplicateStandard(edition, index) {
    return this.request(this.roomUrl('studio/standard/duplicate'), { method: 'POST', body: { edition, index } });
  }
  studioReorderStandard(edition, fromIndex, toIndex) {
    return this.request(this.roomUrl('studio/standard/reorder'), { method: 'POST', body: { edition, fromIndex, toIndex } });
  }
  studioSaveFM(index, question) {
    return this.request(this.roomUrl('studio/fast-money/save'), { method: 'POST', body: { index, question } });
  }
  studioDeleteFM(index) {
    return this.request(this.roomUrl('studio/fast-money/delete'), { method: 'POST', body: { index } });
  }
  studioDuplicateFM(index) {
    return this.request(this.roomUrl('studio/fast-money/duplicate'), { method: 'POST', body: { index } });
  }
  studioReorderFM(fromIndex, toIndex) {
    return this.request(this.roomUrl('studio/fast-money/reorder'), { method: 'POST', body: { fromIndex, toIndex } });
  }
  studioSaveSettings(payload) {
    return this.request(this.roomUrl('studio/settings'), { method: 'PUT', body: payload });
  }
  studioExport() { return this.request(this.roomUrl('studio/export')); }
  studioImport(bundle, confirmed = true) {
    return this.request(this.roomUrl('studio/import'), { method: 'POST', body: { bundle, confirmed } });
  }
  studioLoadChristmasDefaults(confirmed = true) {
    return this.request(this.roomUrl('studio/load-christmas-defaults'), { method: 'POST', body: { confirmed } });
  }
  studioBackup(label) { return this.request(this.roomUrl('studio/backup'), { method: 'POST', body: { label } }); }
  studioRestore(backupId, confirmed = true) {
    return this.request(this.roomUrl('studio/restore'), { method: 'POST', body: { backupId, confirmed } });
  }

  async downloadAnswerKeyPdf(kind) {
    const res = await fetch(this.roomUrl(`pdf/${encodeURIComponent(kind)}`), {
      method: 'GET',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `PDF export forbidden or failed (${res.status}).`);
    }
    const blob = await res.blob();
    const disp = res.headers.get('Content-Disposition') || '';
    const utf8Match = disp.match(/filename\*=UTF-8''([^;]+)/i);
    const asciiMatch = disp.match(/filename="([^"]+)"/);
    const filename = utf8Match
      ? decodeURIComponent(utf8Match[1])
      : asciiMatch
        ? asciiMatch[1]
        : `CHRISTMAS FEUD ${kind.toUpperCase()} ANSWER KEY.pdf`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return filename;
  }
}

export const api = new FeudApiClient();
