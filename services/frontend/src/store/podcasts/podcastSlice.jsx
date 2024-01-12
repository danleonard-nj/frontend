import { createSlice } from '@reduxjs/toolkit';

const podcastInitialState = {
  shows: [],
  showsLoading: true,
  selectedShow: {},
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
    setSelectedShow(state, { payload }) {
      state.selectedShow = payload;
    },
  },
});

export const { setShows, setShowsLoading, setSelectedShow } =
  podcastSlice.actions;

export default podcastSlice.reducer;
