import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dms: {},
  dmsLoading: true,
  disarm: {},
  disarmLoading: false,
  history: [],
  historyLoading: true,
};

const dmsSlice = createSlice({
  name: 'dms',
  initialState: initialState,
  reducers: {
    setDms(state, { payload }) {
      state.dms = payload;
    },
    setDmsLoading(state, { payload }) {
      state.dmsLoading = payload;
    },
    setDisarm(state, { payload }) {
      state.disarm = payload;
    },
    setDisarmLoading(state, { payload }) {
      state.disarmLoading = payload;
    },
    setHistory(state, { payload }) {
      state.history = payload;
    },
    setHistoryLoading(state, { payload }) {
      state.historyLoading = payload;
    },
  },
});

export const {
  setDms,
  setDmsLoading,
  setDisarm,
  setDisarmLoading,
  setHistory,
  setHistoryLoading,
} = dmsSlice.actions;

export default dmsSlice.reducer;
