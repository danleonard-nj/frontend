import { createSlice } from '@reduxjs/toolkit';
import { fitnessState } from '../../api/data/fitness';

const deltaChartReducers = {
  setCalorieDeltas(state, { payload }) {
    state.calorieDeltas = payload;
    state.calorieDeltasLoading = false;
  },
  setCalorieDeltasLoading(state, { payload }) {
    state.calorieDeltasLoading = payload;
  },
};

const fitnessReducers = {
  setFitnessRangeLoading(state, { payload }) {
    state.fitnessDataRangeLoading = payload;
  },

  setFitnessRange(state, { payload }) {
    state.fitnessRange = payload;
    state.fitnessDataRangeLoading = false;
  },
  setFitnessDateRange(state, { payload }) {
    state.fitnessDateRange = payload;
  },
  setConfig(state, { payload }) {
    state.config = payload;
  },
  setConfigEditable(state, { payload }) {
    state.configEditable = payload;
  },
};

const fitness = createSlice({
  name: 'fitness',
  initialState: fitnessState,
  reducers: {
    ...fitnessReducers,
    ...deltaChartReducers,
  },
});

export const {
  setFitnessRangeLoading,
  setFitnessRange,
  setFitnessDateRange,
  setFitnessDatesLoading,
  setFitnessDates,
  setConfig,
  setConfigEditable,
  setCalorieDeltas,
  setCalorieDeltasLoading,
} = fitness.actions;

export default fitness.reducer;
