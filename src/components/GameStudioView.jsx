import React, { useCallback, useEffect, useState } from 'react';

const CAT_ICONS = {
  'Christmas Traditions': '🎄',
  'Christmas Gifts': '🎁',
  'Christmas Movies': '🎬',
  'Christmas Music': '🎵',
  'Christmas Decorations': '✨',
  'Santa Claus and the North Pole': '🎅',
  'Christmas Activities': '⛸️',
  'Christmas Family and Friends': '👨‍👩‍👧‍👦',
  'Winter and Snow': '❄️',
  'Christmas Travel': '✈️',
  'Christmas Parties': '🎉',
  'Christmas Food and Drinks': '🍪',
  'Christmas Shopping': '🛍️',
  'Christmas Characters and Stories': '📖',
  'Funny Christmas Situations': '😂'
};

/**
 * ADMINISTRATOR-ONLY GAME STUDIO EDITOR (5 DEDICATED TABS)
 *  1. Questions (70/100/150) — Left 15-Categories Sidebar + Round List + Edit Round #N (Sum = 100)
 *  2. Fast Money — Private Money Round Question Bank (Sample Answers, Points, Notes, Category)
 *  3. Teams & Settings — Editable Team/Captain Names, Edition, Strikes, Admin & Co-Host PINs
 *  4. PDF Keys — Dedicated Warm Ivory Answer Key (PDF) Showcase with 4 Separate Admin Downloads
 *  5. Import / Export — JSON Export/Import, All-Christmas Default Loader, Server Backup/Restore
 */
export default function GameStudioView({ api, onClose, onToast, onActionError, onRequestConfirm }) {
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('standard');

  // Tab 1: Standard Questions state
  const [selectedEdition, setSelectedEdition] = useState('classic');
  const [selectedRoundIdx, setSelectedRoundIdx] = useState(0);
  const [roundSearch, setRoundSearch] = useState('');
  const [roundCatFilter, setRoundCatFilter] = useState('ALL');
  const [roundDraft, setRoundDraft] = useState(null);

  // Tab 2: Fast Money Bank state
  const [selectedFmIdx, setSelectedFmIdx] = useState(0);
  const [fmSearch, setFmSearch] = useState('');
  const [fmCatFilter, setFmCatFilter] = useState('ALL');
  const [fmDraft, setFmDraft] = useState(null);

  // Tab 3: Settings draft
  const [settingsDraft, setSettingsDraft] = useState(null);

  // Tab 5: Backup label
  const [backupLabel, setBackupLabel] = useState('');

  const refreshStudio = useCallback(async () => {
    try {
      const data = await api.getStudio();
      setStudio(data);
      setSelectedEdition((prev) => (data.editionBanks?.[prev] ? prev : data.edition || 'classic'));
      setSettingsDraft({
        teamAName: data.teams?.teamA?.name || 'TEAM A',
        teamAPlayer: data.teams?.teamA?.playerName || '',
        teamBName: data.teams?.teamB?.name || 'TEAM B',
        teamBPlayer: data.teams?.teamB?.playerName || '',
        edition: data.edition || 'classic',
        maxStrikes: data.settings?.maxStrikes ?? 3,
        quickPointsStep: data.settings?.quickPointsStep ?? 10,
        adminPin: data.adminPin || '',
        hostPin: data.hostPin || ''
      });
    } catch (err) {
      onActionError(err);
    } finally {
      setLoading(false);
    }
  }, [api, onActionError]);

  useEffect(() => {
    refreshStudio();
  }, [refreshStudio]);

  // Sync roundDraft whenever edition, index, or studio data updates
  useEffect(() => {
    if (!studio) return;
    const rounds = studio.editionBanks?.[selectedEdition] || [];
    const safeIdx = Math.min(selectedRoundIdx, Math.max(0, rounds.length - 1));
    if (safeIdx !== selectedRoundIdx) setSelectedRoundIdx(safeIdx);
    const cur = rounds[safeIdx];
    if (cur) {
      setRoundDraft({
        id: cur.id,
        category: cur.category || studio.categories?.[0] || 'Christmas Traditions',
        question: cur.question || '',
        answers: (cur.answers || []).map((a) => ({ text: a.text || '', points: Number(a.points) || 0 }))
      });
    }
  }, [studio, selectedEdition, selectedRoundIdx]);

  // Sync fmDraft whenever selectedFmIdx or studio updates
  useEffect(() => {
    if (!studio) return;
    const bank = studio.fastMoneyBank || [];
    const safeIdx = Math.min(selectedFmIdx, Math.max(0, bank.length - 1));
    if (safeIdx !== selectedFmIdx) setSelectedFmIdx(safeIdx);
    const cur = bank[safeIdx];
    if (cur) {
      setFmDraft({
        id: cur.id,
        set: cur.set || 1,
        category: cur.category || studio.categories?.[0] || 'Christmas Traditions',
        question: cur.question || '',
        acceptedAnswers: (cur.acceptedAnswers || []).map((a) => ({
          text: a.text || '',
          points: Number(a.points) || 1
        })),
        notes: cur.notes || ''
      });
    }
  }, [studio, selectedFmIdx]);

  if (loading && !studio) {
    return (
      <section id="viewStudio" className="view view-studio active">
        <div className="studio-shell" style={{ textAlign: 'center', padding: 48 }}>
          <h2 style={{ color: 'var(--gold-bright)' }}>Loading Administrator Game Studio...</h2>
        </div>
      </section>
    );
  }

  if (!studio) return null;

  const categories = studio.categories || [];
  const banks = studio.editionBanks || { classic: [], deluxe: [], ultimate: [] };
  const rounds = banks[selectedEdition] || [];
  const fmBank = studio.fastMoneyBank || [];

  const filteredRounds = rounds
    .map((r, idx) => ({ r, idx }))
    .filter(({ r }) => {
      const catOk = roundCatFilter === 'ALL' || r.category === roundCatFilter;
      const q = roundSearch.trim().toLowerCase();
      const qOk =
        !q ||
        r.question.toLowerCase().includes(q) ||
        (r.category || '').toLowerCase().includes(q);
      return catOk && qOk;
    });

  const filteredFm = fmBank
    .map((q, idx) => ({ q, idx }))
    .filter(
      ({ q }) =>
        (fmCatFilter === 'ALL' || q.category === fmCatFilter) &&
        (!fmSearch.trim() || q.question.toLowerCase().includes(fmSearch.trim().toLowerCase()))
    );

  const curRoundSum = (roundDraft?.answers || []).reduce(
    (acc, a) => acc + (parseInt(a.points, 10) || 0),
    0
  );

  // --- Standard Round Handlers ---
  const handleAddRound = async () => {
    try {
      await api.studioSaveStandard(selectedEdition, null, {
        category: roundCatFilter !== 'ALL' ? roundCatFilter : 'Christmas Traditions',
        question: 'Name a brand-new festive Christmas survey question.',
        answers: [
          { text: 'Answer One', points: 28 },
          { text: 'Answer Two', points: 22 },
          { text: 'Answer Three', points: 14 },
          { text: 'Answer Four', points: 10 },
          { text: 'Answer Five', points: 8 },
          { text: 'Answer Six', points: 7 },
          { text: 'Answer Seven', points: 6 },
          { text: 'Answer Eight', points: 5 }
        ]
      });
      const updated = await api.getStudio();
      setStudio(updated);
      setSelectedRoundIdx(updated.editionBanks[selectedEdition].length - 1);
      onToast('New round added!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleSaveRound = async () => {
    if (curRoundSum !== 100) {
      onToast(`Point values must total exactly 100 (currently ${curRoundSum}).`, 'error');
      return;
    }
    try {
      await api.studioSaveStandard(selectedEdition, selectedRoundIdx, {
        id: roundDraft.id,
        category: roundDraft.category,
        question: roundDraft.question.trim(),
        answers: roundDraft.answers.map((a) => ({
          text: a.text.trim(),
          points: parseInt(a.points, 10)
        }))
      });
      await refreshStudio();
      onToast(`Round #${selectedRoundIdx + 1} saved! Included immediately in PDF exports.`, 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleMoveRound = async (delta) => {
    const nextIdx = selectedRoundIdx + delta;
    if (nextIdx < 0 || nextIdx >= rounds.length) return;
    try {
      await api.studioReorderStandard(selectedEdition, selectedRoundIdx, nextIdx);
      setSelectedRoundIdx(nextIdx);
      await refreshStudio();
    } catch (err) {
      onActionError(err);
    }
  };

  const handleDuplicateRound = async () => {
    try {
      await api.studioDuplicateStandard(selectedEdition, selectedRoundIdx);
      setSelectedRoundIdx(selectedRoundIdx + 1);
      await refreshStudio();
      onToast('Round duplicated!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleDeleteRound = () => {
    onRequestConfirm({
      title: `Delete Round #${selectedRoundIdx + 1}`,
      message: `Permanently delete Round #${selectedRoundIdx + 1} from ${selectedEdition.toUpperCase()} Edition?`,
      confirmLabel: '🗑 Delete Round',
      confirmClass: 'btn-mini-burgundy',
      onConfirm: async () => {
        try {
          await api.studioDeleteStandard(selectedEdition, selectedRoundIdx);
          await refreshStudio();
          setSelectedRoundIdx((i) => Math.max(0, i - 1));
          onToast('Round deleted.', 'info');
        } catch (err) {
          onActionError(err);
        }
      }
    });
  };

  // --- Fast Money Bank Handlers ---
  const handleAddFmQuestion = async () => {
    try {
      await api.studioSaveFM(null, {
        set: 1,
        category: fmCatFilter !== 'ALL' ? fmCatFilter : 'Christmas Traditions',
        question: 'Name a new Christmas Fast Money survey question.',
        acceptedAnswers: [
          { text: 'Top Answer', points: 34 },
          { text: 'Second Answer', points: 24 },
          { text: 'Third Answer', points: 16 },
          { text: 'Fourth Answer', points: 11 },
          { text: 'Fifth Answer', points: 8 }
        ],
        notes: 'Use host discretion for close wording.'
      });
      const updated = await api.getStudio();
      setStudio(updated);
      setSelectedFmIdx(updated.fastMoneyBank.length - 1);
      onToast('New Fast Money question added!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleSaveFmQuestion = async () => {
    const cleaned = (fmDraft.acceptedAnswers || [])
      .map((a) => ({ text: a.text.trim(), points: parseInt(a.points, 10) || 1 }))
      .filter((a) => a.text);
    try {
      await api.studioSaveFM(selectedFmIdx, {
        id: fmDraft.id,
        set: parseInt(fmDraft.set, 10) || 1,
        category: fmDraft.category,
        question: fmDraft.question.trim(),
        acceptedAnswers: cleaned,
        notes: fmDraft.notes.trim()
      });
      await refreshStudio();
      onToast('Fast Money question saved!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleMoveFm = async (delta) => {
    const nextIdx = selectedFmIdx + delta;
    if (nextIdx < 0 || nextIdx >= fmBank.length) return;
    try {
      await api.studioReorderFM(selectedFmIdx, nextIdx);
      setSelectedFmIdx(nextIdx);
      await refreshStudio();
    } catch (err) {
      onActionError(err);
    }
  };

  const handleDupFm = async () => {
    try {
      await api.studioDuplicateFM(selectedFmIdx);
      setSelectedFmIdx(selectedFmIdx + 1);
      await refreshStudio();
      onToast('Fast Money question duplicated!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleDelFm = () => {
    onRequestConfirm({
      title: `Delete Fast Money Q#${selectedFmIdx + 1}`,
      message: 'Delete this private Fast Money question from the database?',
      confirmLabel: '🗑 Delete Question',
      confirmClass: 'btn-mini-burgundy',
      onConfirm: async () => {
        try {
          await api.studioDeleteFM(selectedFmIdx);
          await refreshStudio();
          setSelectedFmIdx((i) => Math.max(0, i - 1));
          onToast('Fast Money question deleted.', 'info');
        } catch (err) {
          onActionError(err);
        }
      }
    });
  };

  // --- Settings Handler ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.studioSaveSettings({
        teamA: { name: settingsDraft.teamAName.trim(), playerName: settingsDraft.teamAPlayer.trim() },
        teamB: { name: settingsDraft.teamBName.trim(), playerName: settingsDraft.teamBPlayer.trim() },
        edition: settingsDraft.edition,
        maxStrikes: parseInt(settingsDraft.maxStrikes, 10) || 3,
        quickPointsStep: parseInt(settingsDraft.quickPointsStep, 10) || 10,
        adminPin: settingsDraft.adminPin.trim(),
        hostPin: settingsDraft.hostPin.trim()
      });
      await refreshStudio();
      onToast('Teams & settings updated!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  // --- PDF Download Handler ---
  const handleDownloadPdf = async (kind) => {
    try {
      const fn = await api.downloadAnswerKeyPdf(kind);
      onToast(`Downloaded ${fn}`, 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  // --- Import/Export/Backup Handlers ---
  const handleExportJson = async () => {
    try {
      const data = await api.studioExport();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `christmas-feud-studio-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onToast('Studio JSON exported!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleImportJsonFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const bundle = JSON.parse(String(reader.result));
        onRequestConfirm({
          title: 'Confirm Overwrite Studio Data',
          message: `Import "${file.name}"? An automatic server backup of existing data will be created first.`,
          confirmLabel: '✓ Overwrite & Import',
          confirmClass: 'btn-mini-burgundy',
          onConfirm: async () => {
            try {
              await api.studioImport(bundle, true);
              await refreshStudio();
              onToast('Studio JSON imported!', 'success');
            } catch (err) {
              onActionError(err);
            }
          }
        });
      } catch (_) {
        onToast('Invalid JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoadDefaults = () => {
    onRequestConfirm({
      title: 'Confirm Loading Latest 150 All-Christmas Bank',
      message:
        'Replaces your room’s question banks with the full 15-category All-Christmas pack (70 Classic / 100 Deluxe / 150 Ultimate + 30 Fast Money). An automatic backup is saved first.',
      confirmLabel: '✓ Back Up & Load',
      confirmClass: 'btn-emerald-solid',
      onConfirm: async () => {
        try {
          await api.studioLoadChristmasDefaults(true);
          await refreshStudio();
          onToast('150 All-Christmas pack loaded!', 'success');
        } catch (err) {
          onActionError(err);
        }
      }
    });
  };

  const handleCreateBackup = async () => {
    try {
      await api.studioBackup(backupLabel.trim());
      setBackupLabel('');
      await refreshStudio();
      onToast('Backup saved!', 'success');
    } catch (err) {
      onActionError(err);
    }
  };

  const handleRestoreBackup = (backupId) => {
    onRequestConfirm({
      title: 'Confirm Backup Restore',
      message: 'Restore this backup snapshot? Current unsaved edits will be replaced.',
      confirmLabel: '↺ Confirm Restore',
      confirmClass: 'btn-gold',
      onConfirm: async () => {
        try {
          await api.studioRestore(backupId, true);
          await refreshStudio();
          onToast('Backup restored!', 'success');
        } catch (err) {
          onActionError(err);
        }
      }
    });
  };

  return (
    <section id="viewStudio" className="view view-studio active">
      <div className="studio-shell">
        <div className="studio-header">
          <div>
            <h1 className="studio-title">Game Studio Editor</h1>
            <p className="studio-sub">
              Administrator-Only Question Banks, Private Fast Money Keys &amp; Printable Answer-Key
              PDFs
            </p>
          </div>
          <button type="button" className="btn-pill-navy" onClick={onClose}>
            ◀ BACK TO GAME
          </button>
        </div>

        <div className="studio-tabs" role="tablist">
          <button
            type="button"
            className={`studio-tab ${activeTab === 'standard' ? 'active' : ''}`}
            onClick={() => setActiveTab('standard')}
          >
            Questions ({rounds.length})
          </button>
          <button
            type="button"
            className={`studio-tab ${activeTab === 'fastmoney' ? 'active' : ''}`}
            onClick={() => setActiveTab('fastmoney')}
          >
            Fast Money
          </button>
          <button
            type="button"
            className={`studio-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Teams &amp; Settings
          </button>
          <button
            type="button"
            className={`studio-tab ${activeTab === 'pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('pdf')}
          >
            PDF Keys
          </button>
          <button
            type="button"
            className={`studio-tab ${activeTab === 'io' ? 'active' : ''}`}
            onClick={() => setActiveTab('io')}
          >
            Import / Export
          </button>
        </div>

        <div className="studio-content">
          {/* TAB 1: STANDARD QUESTIONS */}
          {activeTab === 'standard' && roundDraft && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginBottom: 10
                }}
              >
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['classic', 'deluxe', 'ultimate'].map((ed) => (
                    <button
                      key={ed}
                      type="button"
                      className={`edition-chip ${selectedEdition === ed ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedEdition(ed);
                        setSelectedRoundIdx(0);
                      }}
                    >
                      {ed.toUpperCase()} ({banks[ed]?.length || 0})
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-mini-emerald"
                    onClick={async () => {
                      try {
                        await api.setEdition(selectedEdition);
                        await refreshStudio();
                        onToast(`Switched live game to ${selectedEdition.toUpperCase()} Edition!`, 'success');
                      } catch (err) {
                        onActionError(err);
                      }
                    }}
                  >
                    ✓ Use {selectedEdition.toUpperCase()} Live
                  </button>
                  <button type="button" className="btn-gold" onClick={handleAddRound}>
                    + ADD ROUND
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.73rem', color: 'var(--ivory-muted)', marginBottom: 10 }}>
                {studio.disclaimer || ''}
              </div>

              <div className="studio-split-3">
                {/* 15-Category Left Sidebar */}
                <div className="studio-cat-sidebar">
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      color: 'var(--gold-bright)',
                      padding: '2px 6px 6px',
                      letterSpacing: '0.08em'
                    }}
                  >
                    CATEGORIES
                  </div>
                  <button
                    type="button"
                    className={`cat-side-btn ${roundCatFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setRoundCatFilter('ALL')}
                  >
                    <span>⭐ All Categories</span>
                    <span>({rounds.length})</span>
                  </button>
                  {categories.map((cat) => {
                    const cnt = rounds.filter((r) => r.category === cat).length;
                    const icon = CAT_ICONS[cat] || '🎄';
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`cat-side-btn ${roundCatFilter === cat ? 'active' : ''}`}
                        onClick={() => setRoundCatFilter(cat)}
                      >
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {icon} {cat}
                        </span>
                        <span>({cnt})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Rounds List */}
                <div className="studio-list-pane">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={roundSearch}
                    onChange={(e) => setRoundSearch(e.target.value)}
                  />
                  <div className="studio-list-scroll">
                    {filteredRounds.map(({ r, idx }) => (
                      <button
                        key={r.id || idx}
                        type="button"
                        className={`studio-round-item ${idx === selectedRoundIdx ? 'active' : ''}`}
                        onClick={() => setSelectedRoundIdx(idx)}
                      >
                        <span className="studio-num-tag">{idx + 1}</span>
                        <span
                          style={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {r.question}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Round Editor */}
                <div className="studio-editor-pane">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginBottom: 10
                    }}
                  >
                    <h3 style={{ color: 'var(--gold-bright)' }}>
                      Edit Round #{selectedRoundIdx + 1}
                    </h3>
                    <span className={`sum-pill ${curRoundSum === 100 ? 'valid' : 'invalid'}`}>
                      Total Points: {curRoundSum} / 100
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1.8fr',
                      gap: 10,
                      marginBottom: 10
                    }}
                  >
                    <div className="fm-field">
                      <label>Category</label>
                      <select
                        value={roundDraft.category}
                        onChange={(e) =>
                          setRoundDraft((d) => ({ ...d, category: e.target.value }))
                        }
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="fm-field">
                      <label>Survey Question</label>
                      <input
                        type="text"
                        maxLength={220}
                        value={roundDraft.question}
                        onChange={(e) =>
                          setRoundDraft((d) => ({ ...d, question: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="studio-answers-grid">
                    {roundDraft.answers.map((a, i) => (
                      <div key={i} className="studio-ans-row">
                        <span className="studio-num-tag">{i + 1}</span>
                        <input
                          type="text"
                          placeholder={`Answer ${i + 1}`}
                          value={a.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRoundDraft((d) => ({
                              ...d,
                              answers: d.answers.map((x, j) => (j === i ? { ...x, text: val } : x))
                            }));
                          }}
                        />
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={a.points}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRoundDraft((d) => ({
                              ...d,
                              answers: d.answers.map((x, j) =>
                                j === i ? { ...x, points: val } : x
                              )
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginTop: 12
                    }}
                  >
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-mini-navy"
                        onClick={() => handleMoveRound(-1)}
                      >
                        ↑ Move Up
                      </button>
                      <button
                        type="button"
                        className="btn-mini-navy"
                        onClick={() => handleMoveRound(1)}
                      >
                        ↓ Move Down
                      </button>
                      <button
                        type="button"
                        className="btn-mini-navy"
                        onClick={handleDuplicateRound}
                      >
                        ⧉ Duplicate
                      </button>
                      <button
                        type="button"
                        className="btn-mini-burgundy"
                        onClick={handleDeleteRound}
                      >
                        🗑 Delete
                      </button>
                    </div>
                    <button type="button" className="btn-gold" onClick={handleSaveRound}>
                      ✓ SAVE CHANGES
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: FAST MONEY QUESTION EDITOR */}
          {activeTab === 'fastmoney' && fmDraft && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginBottom: 10
                }}
              >
                <div>
                  <div style={{ color: 'var(--gold-bright)', fontWeight: 800 }}>
                    🔒 PRIVATE FAST MONEY QUESTION BANK ({fmBank.length} QUESTIONS)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#9CF7C9' }}>
                    Answer keys &amp; notes stay strictly private inside Admin Studio and PDF Keys —
                    NEVER shown during live Fast Money!
                  </div>
                </div>
                <button type="button" className="btn-gold" onClick={handleAddFmQuestion}>
                  + ADD QUESTION
                </button>
              </div>

              <div className="studio-split">
                <div className="studio-list-pane">
                  <select
                    value={fmCatFilter}
                    onChange={(e) => setFmCatFilter(e.target.value)}
                  >
                    <option value="ALL">All Categories ({fmBank.length})</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search Fast Money questions..."
                    value={fmSearch}
                    onChange={(e) => setFmSearch(e.target.value)}
                  />
                  <div className="studio-list-scroll">
                    {filteredFm.map(({ q, idx }) => (
                      <button
                        key={q.id || idx}
                        type="button"
                        className={`studio-round-item ${idx === selectedFmIdx ? 'active' : ''}`}
                        onClick={() => setSelectedFmIdx(idx)}
                      >
                        <span className="studio-num-tag">Q{idx + 1}</span>
                        <span
                          style={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {q.question}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="studio-editor-pane">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 1.6fr',
                      gap: 10,
                      marginBottom: 10
                    }}
                  >
                    <div className="fm-field">
                      <label>Set (1–6)</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={fmDraft.set}
                        onChange={(e) => setFmDraft((d) => ({ ...d, set: e.target.value }))}
                      />
                    </div>
                    <div className="fm-field">
                      <label>Category</label>
                      <select
                        value={fmDraft.category}
                        onChange={(e) => setFmDraft((d) => ({ ...d, category: e.target.value }))}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="fm-field">
                      <label>Question #{selectedFmIdx + 1}</label>
                      <input
                        type="text"
                        maxLength={220}
                        value={fmDraft.question}
                        onChange={(e) => setFmDraft((d) => ({ ...d, question: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: 'var(--gold-bright)',
                      marginBottom: 6
                    }}
                  >
                    PRIVATE ACCEPTED SAMPLE ANSWERS (5–8) &amp; POINT VALUES
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                      marginBottom: 10
                    }}
                  >
                    {fmDraft.acceptedAnswers.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '26px 1fr 72px',
                          gap: 6,
                          alignItems: 'center'
                        }}
                      >
                        <span className="studio-num-tag">{i + 1}</span>
                        <input
                          type="text"
                          value={a.text}
                          placeholder="Sample Answer"
                          onChange={(e) => {
                            const val = e.target.value;
                            setFmDraft((d) => ({
                              ...d,
                              acceptedAnswers: d.acceptedAnswers.map((x, j) =>
                                j === i ? { ...x, text: val } : x
                              )
                            }));
                          }}
                        />
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={a.points}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFmDraft((d) => ({
                              ...d,
                              acceptedAnswers: d.acceptedAnswers.map((x, j) =>
                                j === i ? { ...x, points: val } : x
                              )
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="fm-field" style={{ marginBottom: 12 }}>
                    <label>Administrator Notes (Included in Fast Money Answer Key PDF)</label>
                    <textarea
                      rows={2}
                      value={fmDraft.notes}
                      onChange={(e) => setFmDraft((d) => ({ ...d, notes: e.target.value }))}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8
                    }}
                  >
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-mini-navy"
                        onClick={() => handleMoveFm(-1)}
                      >
                        ↑ Move Up
                      </button>
                      <button
                        type="button"
                        className="btn-mini-navy"
                        onClick={() => handleMoveFm(1)}
                      >
                        ↓ Move Down
                      </button>
                      <button type="button" className="btn-mini-navy" onClick={handleDupFm}>
                        ⧉ Duplicate
                      </button>
                      <button
                        type="button"
                        className="btn-mini-navy"
                        onClick={() => {
                          if (fmDraft.acceptedAnswers.length >= 8) {
                            onToast('Maximum 8 sample answers.', 'info');
                            return;
                          }
                          setFmDraft((d) => ({
                            ...d,
                            acceptedAnswers: [...d.acceptedAnswers, { text: '', points: 5 }]
                          }));
                        }}
                      >
                        + Answer Row
                      </button>
                      <button type="button" className="btn-mini-burgundy" onClick={handleDelFm}>
                        🗑 Delete
                      </button>
                    </div>
                    <button type="button" className="btn-gold" onClick={handleSaveFmQuestion}>
                      ✓ SAVE QUESTION
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: TEAMS & SETTINGS */}
          {activeTab === 'settings' && settingsDraft && (
            <form className="studio-editor-pane" onSubmit={handleSaveSettings}>
              <div className="fm-setup-grid">
                <div className="fm-field">
                  <label>Team A Name</label>
                  <input
                    type="text"
                    value={settingsDraft.teamAName}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, teamAName: e.target.value }))
                    }
                  />
                </div>
                <div className="fm-field">
                  <label>Team A Captain</label>
                  <input
                    type="text"
                    value={settingsDraft.teamAPlayer}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, teamAPlayer: e.target.value }))
                    }
                  />
                </div>
                <div className="fm-field">
                  <label>Active Game Edition</label>
                  <select
                    value={settingsDraft.edition}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, edition: e.target.value }))
                    }
                  >
                    <option value="classic">70 ROUNDS – CLASSIC</option>
                    <option value="deluxe">100 ROUNDS – DELUXE</option>
                    <option value="ultimate">150 ROUNDS – ULTIMATE</option>
                  </select>
                </div>
                <div className="fm-field">
                  <label>Team B Name</label>
                  <input
                    type="text"
                    value={settingsDraft.teamBName}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, teamBName: e.target.value }))
                    }
                  />
                </div>
                <div className="fm-field">
                  <label>Team B Captain</label>
                  <input
                    type="text"
                    value={settingsDraft.teamBPlayer}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, teamBPlayer: e.target.value }))
                    }
                  />
                </div>
                <div className="fm-field">
                  <label>Max Strikes Per Round</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={settingsDraft.maxStrikes}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, maxStrikes: e.target.value }))
                    }
                  />
                </div>
                <div className="fm-field">
                  <label>Quick + / − Points Step</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={settingsDraft.quickPointsStep}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, quickPointsStep: e.target.value }))
                    }
                  />
                </div>
                <div className="fm-field">
                  <label>Administrator PIN (Studio + PDF Keys)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={settingsDraft.adminPin}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, adminPin: e.target.value }))
                    }
                  />
                </div>
                <div className="fm-field">
                  <label>Co-Host PIN (Live Game Only)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={settingsDraft.hostPin}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({ ...d, hostPin: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="submit" className="btn-gold">
                  ✓ SAVE TEAMS &amp; SETTINGS
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: DEDICATED PDF KEYS SHOWCASE */}
          {activeTab === 'pdf' && (
            <div className="pdf-showcase-stage">
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#680A17',
                    marginBottom: 6
                  }}
                >
                  Christmas FEUD — Confidential Administrator Documents
                </div>
                <div className="pdf-showcase-ribbon">ANSWER KEY (PDF)</div>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#523A28',
                    marginTop: 10,
                    maxWidth: 680,
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  Each PDF includes a festive Christmas cover page, category labels, page numbers, 8
                  ranked answers, individual points &amp; round totals dynamically built from your{' '}
                  <strong>current saved database</strong>. Strictly Administrator-only.
                </p>
              </div>

              <div className="pdf-showcase-layout">
                <div className="pdf-badge-card">
                  <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>🎄</div>
                  <div className="pdf-badge-pill">PDF</div>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#680A17'
                    }}
                  >
                    PRINTABLE
                    <br />
                    ANSWER KEYS
                  </div>
                </div>

                <div className="pdf-rows-list">
                  {[
                    {
                      kind: 'classic',
                      title: '70-Round Answer Key (Classic)',
                      sub: `CHRISTMAS FEUD CLASSIC – 70 ROUND ANSWER KEY.pdf • ${banks.classic.length} saved rounds`
                    },
                    {
                      kind: 'deluxe',
                      title: '100-Round Answer Key (Deluxe)',
                      sub: `CHRISTMAS FEUD DELUXE – 100 ROUND ANSWER KEY.pdf • ${banks.deluxe.length} saved rounds`
                    },
                    {
                      kind: 'ultimate',
                      title: '150-Round Answer Key (Ultimate)',
                      sub: `CHRISTMAS FEUD ULTIMATE – 150 ROUND ANSWER KEY.pdf • ${banks.ultimate.length} saved rounds`
                    },
                    {
                      kind: 'fast-money',
                      title: 'Fast Money Answer Key',
                      sub: `CHRISTMAS FEUD FAST MONEY ANSWER KEY.pdf • ${fmBank.length} private questions & admin notes`
                    }
                  ].map((item) => (
                    <div key={item.kind} className="pdf-download-row">
                      <div className="pdf-row-info">
                        <span className="pdf-check">✓</span>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '0.96rem', color: '#2A0B10' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#6A4D36' }}>{item.sub}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-gold"
                        onClick={() => handleDownloadPdf(item.kind)}
                      >
                        ⬇ Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: IMPORT / EXPORT & SERVER BACKUPS */}
          {activeTab === 'io' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="studio-editor-pane">
                <h3 style={{ color: 'var(--gold-bright)', marginBottom: 8 }}>
                  JSON IMPORT / EXPORT &amp; DEFAULT PACK
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button type="button" className="btn-gold" onClick={handleExportJson}>
                    ⬇ EXPORT FULL STUDIO JSON
                  </button>
                  <label
                    className="btn-pill-navy"
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                  >
                    ⬆ IMPORT STUDIO JSON FILE
                    <input
                      type="file"
                      accept=".json,application/json"
                      style={{ display: 'none' }}
                      onChange={handleImportJsonFile}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn-emerald-solid"
                    onClick={handleLoadDefaults}
                  >
                    🎄 Load Latest 150 All-Christmas Default Bank
                  </button>
                </div>
              </div>

              <div className="studio-editor-pane">
                <h3 style={{ color: 'var(--gold-bright)', marginBottom: 8 }}>
                  SERVER BACKUP &amp; RESTORE
                </h3>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder="Backup label (e.g. Holiday Show Copy)"
                    value={backupLabel}
                    onChange={(e) => setBackupLabel(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-mini-emerald"
                    onClick={handleCreateBackup}
                  >
                    💾 Backup
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    maxHeight: 190,
                    overflowY: 'auto'
                  }}
                >
                  {(studio.backups || []).length > 0 ? (
                    studio.backups.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 10px',
                          borderRadius: 8,
                          background: 'rgba(0,0,0,0.28)',
                          border: '1px solid var(--gold-soft)'
                        }}
                      >
                        <div>
                          <strong>{b.label}</strong>
                          <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>
                            {new Date(b.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-mini-gold"
                          onClick={() => handleRestoreBackup(b.id)}
                        >
                          ↺ Restore
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.8rem', opacity: 0.75 }}>No backups saved yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
