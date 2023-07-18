import { createSlice } from '@reduxjs/toolkit';

const weatherSliceInitialState = {
  weather: {},
  weatherLoading: true,
  forecast: [],
  forecastLoading: true,
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
    setForecast(state, { payload }) {
      state.forecast = payload;
    },
    setForecastLoading(state, { payload }) {
      state.forecastLoading = payload;
    },
    setZipCode(state, { payload }) {
      state.zipCode = payload;
    },
  },
});

export const {
  setWeather,
  setWeatherLoading,
  setZipCode,
  setForecast,
  setForecastLoading,
} = weatherSlice.actions;

export default weatherSlice.reducer;
