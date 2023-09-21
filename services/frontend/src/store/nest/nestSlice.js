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
  sensorHistoryLoading: false,
  selectedSensor: {},
  thermostat: {},
  thermostatLoading: true,
  commands: [],
  commandsLoading: true,
  commandParameters: {
    heat_degrees_fahrenheit: 78,
    cool_degrees_fahrenheit: 72,
  },
  commandLoading: false,
  events: [],
  eventsLoading: true,
  sensorEvents: [],
  analyticsData: [],
  analyticsDataLoading: true,
};

const eventReducers = {
  setEvents(state, { payload }) {
    state.events = payload;
  },
  setEventsLoading(state, { payload }) {
    state.eventsLoading = payload;
  },
  setSensorEvents(state, { payload }) {
    state.sensorEvents = payload;
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
  setCommandLoading(state, { payload }) {
    state.commandLoading = payload;
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
  },
  setSensorInfoLoading(state, { payload }) {
    state.sensorInfoLoading = payload;
  },
  setSensorHistoryDateParams(state, { payload }) {
    state.sensorHistoryDateParams = payload;
  },
  setSensorHistory(state, { payload }) {
    state.sensorHistory = payload;
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
    ...eventReducers,
    setAnalyticsData(state, { payload }) {
      state.analyticsData = payload;
    },
    setAnalyticsDataLoading(state, { payload }) {
      state.analyticsDataLoading = payload;
    },
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
  setCommandLoading,
  setEvents,
  setEventsLoading,
  setSensorEvents,
  setAnalyticsData,
  setAnalyticsDataLoading,
} = nestSlice.actions;

export default nestSlice.reducer;
