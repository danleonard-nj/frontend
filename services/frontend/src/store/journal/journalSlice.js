import { createSlice } from '@reduxjs/toolkit';

// Tab values for the journal layout's top-level Tabs control.
export const JOURNAL_TAB = {
  WRITE: 'write',
  JOURNAL: 'journal',
  INSIGHTS: 'insights',
};

const INITIAL_DRAFT = {
  // Captured-but-not-committed transcript clips.
  segments: [],
  // Whether the current draft was just committed (drives the
  // "Committing…" / disabled state on the Write tab).
  committed: false,
  // Local overrides that have not yet been persisted.
  titleOverride: null,
  transcriptOverride: null,
  // Files staged on the Write tab; uploaded after the entry commits.
  stagedAttachments: [],
};

const INITIAL_UI = {
  searchValue: '',
  // Id of the entry shown in the detail pane. `null` means "new draft".
  selectedEntryId: null,
  activeTab: JOURNAL_TAB.WRITE,
  insightsDaysBack: 3,
  confirmDeleteOpen: false,
  // Tracks the most recently polished entry so we can show an Undo button
  // even on entries that don't expose `pre_polish_transcript` directly.
  polishedEntryId: null,
  // Tracks an entry committed in this browser session, so the Write tab
  // can show its analysis card after navigating away.
  committedEntryId: null,
};

const initialState = {
  entries: [],
  entriesLoading: false,
  insights: null,
  insightsLoading: false,
  insightsError: null,
  commitError: null,
  committing: false,
  // Per-entry detail (full record from GET /entries/:id), keyed by id.
  // Shape: { [id]: { entry, loading, processing, error } }
  entryDetails: {},
  // Global list of distinct tags across all entries (sorted).
  tags: [],
  tagsLoading: false,
  // Per-entry attachments, keyed by entryId.
  // Shape: { [id]: { items: [], pending: [], loading: false, error: null } }
  attachments: {},
  // UI state for the journal layout (search, active tab, selection, etc.)
  ui: INITIAL_UI,
  // In-progress draft state for the Write tab.
  draft: INITIAL_DRAFT,
};

function ensureAttachments(state, id) {
  if (!state.attachments[id]) {
    state.attachments[id] = {
      items: [],
      pending: [],
      loading: false,
      error: null,
    };
  }
  return state.attachments[id];
}

function ensureDetail(state, id) {
  if (!state.entryDetails[id]) {
    state.entryDetails[id] = {
      entry: null,
      loading: false,
      processing: false,
      error: null,
    };
  }
  return state.entryDetails[id];
}

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    setEntriesLoading(state, { payload }) {
      state.entriesLoading = payload;
    },
    setEntries(state, { payload }) {
      state.entries = payload;
      state.entriesLoading = false;
    },
    prependEntry(state, { payload }) {
      state.entries = [
        payload,
        ...state.entries.filter((e) => e.id !== payload.id),
      ];
    },
    updateEntry(state, { payload }) {
      state.entries = state.entries.map((e) =>
        e.id === payload.id ? { ...e, ...payload } : e,
      );
    },
    removeEntry(state, { payload }) {
      state.entries = state.entries.filter((e) => e.id !== payload);
    },
    setInsightsLoading(state, { payload }) {
      state.insightsLoading = payload;
    },
    setInsights(state, { payload }) {
      state.insights = payload;
      state.insightsLoading = false;
      state.insightsError = null;
    },
    setInsightsError(state, { payload }) {
      state.insightsError = payload;
      state.insightsLoading = false;
    },
    setCommitting(state, { payload }) {
      state.committing = payload;
    },
    setCommitError(state, { payload }) {
      state.commitError = payload;
    },
    setEntryDetailLoading(state, { payload }) {
      const { id, loading } = payload;
      ensureDetail(state, id).loading = loading;
    },
    setEntryDetail(state, { payload }) {
      const { id, entry } = payload;
      const detail = ensureDetail(state, id);
      detail.entry = entry;
      detail.loading = false;
      detail.error = null;
    },
    setEntryDetailError(state, { payload }) {
      const { id, error } = payload;
      const detail = ensureDetail(state, id);
      detail.error = error;
      detail.loading = false;
    },
    setEntryDetailProcessing(state, { payload }) {
      const { id, processing } = payload;
      ensureDetail(state, id).processing = processing;
    },
    clearEntryDetail(state, { payload }) {
      delete state.entryDetails[payload];
    },
    setTagsLoading(state, { payload }) {
      state.tagsLoading = payload;
    },
    setTags(state, { payload }) {
      state.tags = Array.isArray(payload) ? payload : [];
      state.tagsLoading = false;
    },
    mergeTags(state, { payload }) {
      if (!Array.isArray(payload) || payload.length === 0) return;
      const set = new Set(state.tags);
      for (const t of payload) {
        if (typeof t === 'string' && t.trim()) set.add(t.trim());
      }
      state.tags = Array.from(set).sort((a, b) => a.localeCompare(b));
    },
    setAttachmentsLoading(state, { payload }) {
      const { id, loading } = payload;
      ensureAttachments(state, id).loading = loading;
    },
    setAttachments(state, { payload }) {
      const { id, items } = payload;
      const att = ensureAttachments(state, id);
      att.items = Array.isArray(items) ? items : [];
      att.loading = false;
      att.error = null;
    },
    setAttachmentsError(state, { payload }) {
      const { id, error } = payload;
      const att = ensureAttachments(state, id);
      att.error = error;
      att.loading = false;
    },
    addPendingAttachment(state, { payload }) {
      const { id, pending } = payload;
      const att = ensureAttachments(state, id);
      att.pending = [
        ...att.pending.filter((p) => p.tempId !== pending.tempId),
        pending,
      ];
    },
    updatePendingAttachment(state, { payload }) {
      const { id, tempId, changes } = payload;
      const att = ensureAttachments(state, id);
      att.pending = att.pending.map((p) =>
        p.tempId === tempId ? { ...p, ...changes } : p,
      );
    },
    removePendingAttachment(state, { payload }) {
      const { id, tempId } = payload;
      const att = ensureAttachments(state, id);
      att.pending = att.pending.filter((p) => p.tempId !== tempId);
    },
    addAttachment(state, { payload }) {
      const { id, attachment } = payload;
      const att = ensureAttachments(state, id);
      const aid =
        attachment?.attachment_id ||
        attachment?.id ||
        attachment?.attachmentId;
      att.items = [
        ...att.items.filter(
          (a) => (a.attachment_id || a.id || a.attachmentId) !== aid,
        ),
        attachment,
      ];
    },
    removeAttachment(state, { payload }) {
      const { id, attachmentId } = payload;
      const att = ensureAttachments(state, id);
      att.items = att.items.filter(
        (a) =>
          (a.attachment_id || a.id || a.attachmentId) !==
          attachmentId,
      );
    },
    clearAttachments(state, { payload }) {
      delete state.attachments[payload];
    },

    // ── UI state ─────────────────────────────────────────────────────
    setSearchValue(state, { payload }) {
      state.ui.searchValue = payload || '';
    },
    setSelectedEntryId(state, { payload }) {
      state.ui.selectedEntryId = payload || null;
    },
    setActiveTab(state, { payload }) {
      state.ui.activeTab = payload;
    },
    setInsightsDaysBack(state, { payload }) {
      state.ui.insightsDaysBack = payload;
    },
    setConfirmDeleteOpen(state, { payload }) {
      state.ui.confirmDeleteOpen = Boolean(payload);
    },
    setPolishedEntryId(state, { payload }) {
      state.ui.polishedEntryId = payload || null;
    },
    setCommittedEntryId(state, { payload }) {
      state.ui.committedEntryId = payload || null;
    },

    // ── Draft state ──────────────────────────────────────────────────
    appendDraftSegment(state, { payload }) {
      state.draft.segments.push(payload);
      state.draft.committed = false;
      state.draft.transcriptOverride = null;
    },
    popDraftSegment(state) {
      state.draft.segments.pop();
      state.draft.transcriptOverride = null;
    },
    setDraftSegments(state, { payload }) {
      state.draft.segments = Array.isArray(payload) ? payload : [];
    },
    setTitleOverride(state, { payload }) {
      state.draft.titleOverride = payload;
    },
    setTranscriptOverride(state, { payload }) {
      state.draft.transcriptOverride = payload;
    },
    setStagedAttachments(state, { payload }) {
      state.draft.stagedAttachments = Array.isArray(payload)
        ? payload
        : [];
    },
    setCommitted(state, { payload }) {
      state.draft.committed = Boolean(payload);
    },
    resetDraft(state) {
      state.draft = INITIAL_DRAFT;
      state.commitError = null;
    },
  },
});

export const {
  setEntriesLoading,
  setEntries,
  prependEntry,
  updateEntry,
  removeEntry,
  setInsightsLoading,
  setInsights,
  setInsightsError,
  setCommitting,
  setCommitError,
  setEntryDetailLoading,
  setEntryDetail,
  setEntryDetailError,
  setEntryDetailProcessing,
  clearEntryDetail,
  setTagsLoading,
  setTags,
  mergeTags,
  setAttachmentsLoading,
  setAttachments,
  setAttachmentsError,
  addPendingAttachment,
  updatePendingAttachment,
  removePendingAttachment,
  addAttachment,
  removeAttachment,
  clearAttachments,
  setSearchValue,
  setSelectedEntryId,
  setActiveTab,
  setInsightsDaysBack,
  setConfirmDeleteOpen,
  setPolishedEntryId,
  setCommittedEntryId,
  appendDraftSegment,
  popDraftSegment,
  setDraftSegments,
  setTitleOverride,
  setTranscriptOverride,
  setStagedAttachments,
  setCommitted,
  resetDraft,
} = journalSlice.actions;

export default journalSlice.reducer;
