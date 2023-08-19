import { createSlice } from '@reduxjs/toolkit';

const eventInitialState = {
  events: [],
  eventsLoading: true,
};

const eventSlice = createSlice({
  name: 'event',
  initialState: eventInitialState,
  reducers: {
    setEvents(state, { payload }) {
      state.events = payload;
    },
    setEventsLoading(state, { payload }) {
      state.eventsLoading = payload;
    },
  },
});

export const { setEvents, setEventsLoading } = eventSlice.actions;

export default eventSlice.reducer;
