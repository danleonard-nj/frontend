import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dms: {},
  dmsLoading: true,
  disarm: {},
  disarmLoading: false,
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
  },
});

export const { setDms, setDmsLoading, setDisarm, setDisarmLoading } =
  dmsSlice.actions;

export default dmsSlice.reducer;
