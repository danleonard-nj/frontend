import { createSlice } from '@reduxjs/toolkit';
import { nestState } from '../../api/data/nest';

const nestSlice = createSlice({
  name: 'nest',
  initialState: nestState,
  reducers: {
    setSensorInfo(state, { payload }) {
      state.sensorsLoading = false;
      state.sensors = payload;
    },
    setSensorInfoLoading(state, { payload }) {
      state.sensorsLoading = true;
    },
    setThermostatInfo(state, { payload }) {
      state.thermostatLoading = false;
      state.thermostat = payload;
    },
    setThermostatInfoLoading(state, { payload }) {
      state.thermostatLoading = true;
    },
    setSelectedSensor(state, { payload }) {
      state.selectedSensor = payload;
    },
  },
});

export const {
  setSensorInfo,
  setSensorInfoLoading,
  setThermostatInfo,
  setThermostatInfoLoading,
  setSelectedSensor,
} = nestSlice.actions;

export default nestSlice.reducer;
