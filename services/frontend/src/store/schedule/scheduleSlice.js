import { createSlice } from '@reduxjs/toolkit';
import { scheduleState, scheduleTemplate } from '../../api/data/schedule';

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
    setSchedule(state, { payload }) {
      state.schedule = payload;
    },
    setScheduleLoading(state, { payload }) {
      state.scheduleLoading = true;
    },
    setSchedules(state, { payload }) {
      state.schedulesLoading = false;
      state.schedules = payload;
    },
    setSchedulesLoading(state) {
      state.schedulesLoading = true;
    },
    setLinkOptions(state, { payload }) {
      state.linkOptions = payload;
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
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
