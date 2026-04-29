import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entries: [],
  entriesLoading: false,
  insights: null,
  insightsLoading: false,
  insightsError: null,
  commitError: null,
  committing: false,
};

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
} = journalSlice.actions;

export default journalSlice.reducer;
