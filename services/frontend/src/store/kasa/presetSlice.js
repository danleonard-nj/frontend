import { createSlice } from '@reduxjs/toolkit';
import { presetState } from '../../api/data/kasa/preset';

const presetSlice = createSlice({
  name: 'preset',
  initialState: presetState,
  reducers: {
    presetsLoading(state, { payload }) {
      state.presetsLoading = payload;
    },
    setPresets(state, { payload }) {
      state.presets = payload;
      state.presetsLoading = false;
    },
    presetLoading(state, { payload }) {
      state.presetLoading = payload;
    },
    setPreset(state, { payload }) {
      state.preset = payload;
      state.presetLoading = false;
    },
    updatePreset(state, { payload }) {
      state.preset = payload;
    },
    setNewPreset(state, { payload }) {
      state.isNewPreset = payload;
    },
  },
});

export const {
  presetsLoading,
  presetLoading,
  setPresets,
  setPreset,
  updatePreset,
  setNewPreset,
} = presetSlice.actions;

export default presetSlice.reducer;
