import { createSlice } from '@reduxjs/toolkit';

const torrentsInitialState = {
  searchTerm: '',
  torrents: [],
  torrentsLoading: true,
  page: 1,
  magnetLoading: false,
  magnet: '',
  torrentSource: 'piratebay',
};

const torrentSlice = createSlice({
  name: 'torrents',
  initialState: torrentsInitialState,
  reducers: {
    setTorrents(state, { payload }) {
      state.torrents = payload;
    },
    setTorrentsLoading(state, { payload }) {
      state.torrentsLoading = payload;
    },
    setMagent(state, { payload }) {
      state.magnet = payload;
    },
    setMagnetLoading(state, { payload }) {
      state.magnetLoading = payload;
    },
    setSearchTerm(state, { payload }) {
      state.searchTerm = payload;
    },
    setPage(state, { payload }) {
      state.page = payload;
    },
    setTorrentSource(state, { payload }) {
      state.torrentSource = payload;
    },
  },
});

export const {
  setTorrents,
  setSearchTerm,
  setTorrentsLoading,
  setMagent,
  setMagnetLoading,
  setPage,
  setTorrentSource,
} = torrentSlice.actions;

export default torrentSlice.reducer;
