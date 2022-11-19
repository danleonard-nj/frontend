import { createSlice } from '@reduxjs/toolkit';
import { dashboardState } from '../../api/data/dashboard.js';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: dashboardState,
  reducers: {
    setPage(state, { payload }) {
      state.page = payload;
    },
    setSideMenu(state, { payload }) {
      state.sideMenuOpen = payload;
    },
  },
});

export const { setPage, setSideMenu } = dashboardSlice.actions;

export default dashboardSlice.reducer;
