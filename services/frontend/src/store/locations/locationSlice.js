import { createSlice } from '@reduxjs/toolkit';

const defaultQuery = {
  latitude: 0,
  longitude: 0,
  limit: 10,
  range: 10,
  include_timestamps: true,
};

const initialState = {
  locations: [],
  locationsLoading: false,
  selectedLocation: false,
  locationTab: 0,
  querySettings: defaultQuery,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocations(state, { payload }) {
      state.locationsLoading = false;
      state.locations = payload;
    },
    setLocationsLoading(state, { payload }) {
      state.locationsLoading = payload;
    },
    setSelectedLocation(state, { payload }) {
      state.selectedLocation = payload;
    },
    setLocationTab(state, { payload }) {
      state.locationTab = payload;
    },
    setQuerySettings(state, { payload }) {
      state.querySettings = payload;
    },
  },
});

export const {
  setLocations,
  setLocationsLoading,
  setSelectedLocation,
  setLocationTab,
  setQuerySettings,
} = locationSlice.actions;

export default locationSlice.reducer;
