import autoBind from 'auto-bind';
import { createDeltaChartData } from '../../api/data/fitness';
import FitnessApi from '../../api/fitnessApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setCalorieDeltas,
  setCalorieDeltasLoading,
  setConfig,
  setFitnessRange,
  setFitnessRangeLoading,
} from './fitnessSlice';

export default class FitnessActions {
  constructor() {
    this.fitnessApi = new FitnessApi();
    autoBind(this);
  }

  getFitnessRange() {
    return async (dispatch, getState) => {
      const state = getState();
      dispatch(setFitnessRangeLoading(true));

      // Fetch fitness range data
      const response = await this.fitnessApi.getFitnessRange(
        state.fitness.fitnessDateRange.startDate,
        state.fitness.fitnessDateRange.endDate
      );

      // Pop an error message on failure
      if (response?.status !== 200) {
        dispatch(popErrorMessage('Failed to fetch fitness range data'));
      } else {
        // Update fitness range state on successful request
        dispatch(setFitnessRange(response?.data));
      }

      dispatch(setFitnessRangeLoading(false));
    };
  }

  getFitnessCalorieDeltas() {
    return async (dispatch, getState) => {
      const state = getState();
      dispatch(setCalorieDeltasLoading(true));

      const response = await this.fitnessApi.getCalorieDeltas(
        state.fitness.fitnessDateRange.startDate,
        state.fitness.fitnessDateRange.endDate
      );

      // Pop an error message on failure
      if (response?.status !== 200) {
        dispatch(popErrorMessage('Failed to fetch fitness calorie deltas'));
      } else {
        // Update state on successful request
        dispatch(setCalorieDeltas(response?.data));
        dispatch(setCalorieDeltasLoading(false));
      }
    };
  }

  createConfig() {
    return async (dispatch, getState) => {
      const state = getState();
      const results = await this.fitnessApi.createConfig(state.fitness.config);
      dispatch(setConfig(results));
    };
  }

  getConfig() {
    return async (dispatch, getState) => {
      const results = await this.fitnessApi.getConfig();
      dispatch(setConfig(results));
    };
  }
}

export const {
  getFitnessRange,
  getFitnessCalorieDeltas,
  getConfig,
  createConfig,
} = new FitnessActions();
