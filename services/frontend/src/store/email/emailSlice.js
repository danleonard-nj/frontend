import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emailRules: [],
  emailRulesLoading: true,
  selectedEmail: '',
};

const emailSlice = createSlice({
  name: 'email',
  initialState: initialState,
  reducers: {
    setLocations(state, { payload }) {
      state.locationsLoading = false;
      state.locations = payload;
    },
  },
});

export const { name, set } = locationSlice.actions;

export default emailSlice.reducer;
