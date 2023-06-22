import { createSlice } from '@reduxjs/toolkit';

const getDefaultStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.getTime() / 1000;
};

const nestInitialState = {
  sensorInfo: [],
  sensorInfoLoading: true,
  sensorHistory: [],
  sensorHistoryLoading: true,
  sensorHistoryDateParams: {
    startTimestamp: getDefaultStartDate(),
    endTimestamp: 0,
  },
  selectedSensor: {},
  thermostat: {},
  thermostatLoading: true,
  commands: [],
  commandsLoading: true,
  commandParameters: {
    heat_degrees_fahrenheit: 78,
    cool_degrees_fahrenheit: 72,
  },
};

const commandReducers = {
  setCommands(state, { payload }) {
    state.commands = payload;
    state.commandsLoading = false;
  },
  setCommandsLoading(state, { payload }) {
    state.commandsLoading = payload;
  },
  setCommandParameters(state, { payload }) {
    state.commandParameters = payload;
  },
};

const thermostatReducers = {
  setThermosat(state, { payload }) {
    state.thermostat = payload;
    state.thermostatLoading = false;
  },
  setThermosatLoading(state, { payload }) {
    state.thermostatLoading = payload;
  },
};

const sensorReducers = {
  setSensorInfo(state, { payload }) {
    state.sensorInfo = payload;
    state.sensorInfoLoading = false;
  },
  setSensorInfoLoading(state, { payload }) {
    state.sensorInfoLoading = payload;
  },
  setSensorHistoryDateParams(state, { payload }) {
    state.sensorHistoryDateParams = payload;
  },
  setSensorHistory(state, { payload }) {
    state.sensorHistory = payload;
    state.sensorHistoryLoading = false;
  },
  setSensorHistoryLoading(state, { payload }) {
    state.sensorHistoryLoading = payload;
  },
  setSelectedSensor(state, { payload }) {
    state.selectedSensor = payload;
  },
};

const nestSlice = createSlice({
  name: 'nest',
  initialState: nestInitialState,
  reducers: {
    ...sensorReducers,
    ...thermostatReducers,
    ...commandReducers,
  },
});

export const {
  setSensorHistory,
  setSensorHistoryDateParams,
  setSensorHistoryLoading,
  setSensorInfo,
  setSensorInfoLoading,
  setSelectedSensor,
  setThermosat,
  setThermosatLoading,
  setCommands,
  setCommandsLoading,
  setCommandParameters,
} = nestSlice.actions;

export default nestSlice.reducer;
