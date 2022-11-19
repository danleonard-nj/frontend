import { Tty } from '@mui/icons-material';
import { createSlice } from '@reduxjs/toolkit';

const destinationReminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setDestinationReminder(state, { payload }) {
      state.locationsLoading = false;
      state.locations = payload;
    },
  },
});

export const {} = destinationReminderSlice.actions;

export default destinationReminderSlice.reducer;
