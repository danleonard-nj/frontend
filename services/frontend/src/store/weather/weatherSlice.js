import { createSlice } from '@reduxjs/toolkit';

const weatherSliceInitialState = {
  weather: {},
  weatherLoading: true,
  zipCode: '85032',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState: weatherSliceInitialState,
  reducers: {
    setWeather(state, { payload }) {
      state.weather = payload;
    },
    setWeatherLoading(state, { payload }) {
      state.weatherLoading = payload;
    },
    setZipCode(state, { payload }) {
      state.zipCode = payload;
    },
  },
});

export const { setWeather, setWeatherLoading, setZipCode } =
  weatherSlice.actions;

export default weatherSlice.reducer;
