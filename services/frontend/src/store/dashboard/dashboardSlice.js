import { createSlice } from '@reduxjs/toolkit';
import {
  dashboardState,
  DASHBOARD_PAGE_KEY,
} from '../../api/data/dashboard.js';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: dashboardState,
  reducers: {
    setPage(state, { payload }) {
      state.page = payload;
      try {
        localStorage.setItem(DASHBOARD_PAGE_KEY, payload);
      } catch {
        // localStorage unavailable
      }
    },
    setSideMenu(state, { payload }) {
      state.sideMenuOpen = payload;
    },
  },
});

export const { setPage, setSideMenu } = dashboardSlice.actions;

export default dashboardSlice.reducer;
