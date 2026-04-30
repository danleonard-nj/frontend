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
};

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
} = journalSlice.actions;

export default journalSlice.reducer;
