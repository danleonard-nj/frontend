import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  flow: [],
  selectedDevices: [],
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    updateFlow(state, { payload }) {
      state.flow = payload;
    },
  },
});

export const { updateFlow } = flowSlice.actions;

export default flowSlice.reducer;
