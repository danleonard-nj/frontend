import { createSlice } from '@reduxjs/toolkit';

const podcastInitialState = {
  shows: [],
  showsLoading: true,
};

const podcastSlice = createSlice({
  name: 'podcast',
  initialState: podcastInitialState,
  reducers: {
    setShows(state, { payload }) {
      state.shows = payload;
    },
    setShowsLoading(state, { payload }) {
      state.showsLoading = payload;
    },
  },
});

export const {} = podcastSlice.actions;

export default podcastSlice.reducer;
