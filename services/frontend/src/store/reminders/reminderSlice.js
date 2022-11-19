import { Tty } from '@mui/icons-material';
import { createSlice } from '@reduxjs/toolkit';
import { defaultDestinationReminder } from './defaultReminders';

const getDefaultLocation = () => ({
  locationName: '',
  locationAddress: '',
});

const defaultReminder = {
  reminderName: 'Test',
  reminderType: 'Destination',
  frequencyType: 'Recurring',
  frequency: '0 22 * * *',
  timezone: 'America/Phoenix',
  notificationId: 'placeholder',
  destination: {
    destinationLocationId: '',
    notificationWindowMinutes: 90,
    notificationIntervalMinutes: 15,
    arrivalWindowMinutes: 10,
    originLocationId: '',
    transitDurationSeconds: 0,
    transitDistanceMeters: 0,
  },
};

const initialState = {
  remindersLoading: true,
  reminders: [],
  reminder: defaultReminder,
  notificationsLoading: true,
  notifications: [],
  notification: {},
  locationsLoading: true,
  locations: [],
  location: {},
  geoLocation: {},
  timezonesLoading: true,
  timezones: [],
  cronDescriptor: '',
  isNew: false,
};

const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setLocations(state, { payload }) {
      state.locationsLoading = false;
      state.locations = payload;
    },
    setNotifications(state, { payload }) {
      state.notificationsLoading = false;
      state.notifications = payload;
    },
    setReminders(state, { payload }) {
      state.remindersLoading = false;
      state.reminders = payload;
    },
    setTimezones(state, { payload }) {
      state.timezonesLoading = false;
      state.timezones = payload;
    },
    setReminder(state, { payload }) {
      state.reminder = payload;
    },
    setDefaultReminder(state) {
      state.reminder = defaultReminder;
    },
    setNewReminder(state, { payload }) {
      state.isNew = payload;
      state.reminder = defaultDestinationReminder;
    },
    setCronDescriptor(state, { payload }) {
      state.cronDescriptor = payload;
    },
    setLocation(state, { payload }) {
      state.location = payload;
    },
    setSelectedLocation(state, { payload }) {
      state.location = state.locations.find((x) => x.locationId == payload);
    },
    modifyReminder(state, { payload }) {
      const updated = payload(state.reminder);
      state.reminder = { ...updated };
    },
    newLocation(state) {
      state.location = getDefaultLocation();
    },
    setLocationIsNew(state, { payload }) {
      state.location.isNew = payload;
    },
    setNotification(state, { payload }) {
      state.notification = payload;
    },
    setGeoLocation(state, { payload }) {
      state.geoLocation = payload;
    },
  },
});

export const {
  setReminders,
  setNotifications,
  setLocationIsNew,
  setLocations,
  setReminder,
  setTimezones,
  setCronDescriptor,
  setNewReminder,
  setDefaultReminder,
  modifyReminder,
  newLocation,
  setLocation,
  setSelectedLocation,
  setNotification,
  setGeoLocation,
} = reminderSlice.actions;

export default reminderSlice.reducer;
