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
  },
});

export const {
  setSensorHistory,
  setSensorHistoryDateParams,
  setSensorHistoryLoading,
  setSensorInfo,
  setSensorInfoLoading,
  setSelectedSensor,
} = nestSlice.actions;

export default nestSlice.reducer;
