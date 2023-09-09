import { createSlice } from '@reduxjs/toolkit';
import {
  scheduleState,
  scheduleTemplate,
} from '../../api/data/schedule';

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: scheduleState,
  reducers: {
    newSchedule(state) {
      state.isNew = true;
      state.schedule = scheduleTemplate;
    },
    setIsNew(state, { payload }) {
      state.isNew = payload;
    },
    setIsScheduleModified(state, { payload }) {
      state.isScheduleModified = payload;
    },
    setSchedule(state, { payload }) {
      state.schedule = payload;
    },
    setScheduleLoading(state, { payload }) {
      state.scheduleLoading = payload;
    },
    setSchedules(state, { payload }) {
      state.schedulesLoading = false;
      state.schedules = payload;
    },
    setSchedulesLoading(state) {
      state.schedulesLoading = true;
    },
    setScheduleHistory(state, { payload }) {
      state.scheduleHistoryLoading = false;
      state.scheduleHistory = payload;
    },
    setScheduleHistoryLoading(state) {
      state.scheduleHistoryLoading = true;
    },
    setLinkOptions(state, { payload }) {
      state.linkOptions = payload;
    },
    setSelectedSchedule(state, { payload }) {
      state.selectedSchedule = payload;
    },
  },
});

export const {
  setLinkOptions,
  setSchedule,
  newSchedule,
  setSchedules,
  setScheduleLoading,
  setSchedulesLoading,
  setIsNew,
  setScheduleHistory,
  setScheduleHistoryLoading,
  setSelectedSchedule,
  setIsScheduleModified,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
