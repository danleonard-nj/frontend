import { createSlice } from '@reduxjs/toolkit';

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
} = journalSlice.actions;

export default journalSlice.reducer;
