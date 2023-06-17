import autoBind from 'auto-bind';
import NestApi from '../../api/nestApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setSensorHistory,
  setSensorHistoryLoading,
  setSensorInfo,
  setSensorInfoLoading,
} from './nestSlice';

export default class NestActions {
  constructor() {
    this.nestApi = new NestApi();
    autoBind(this);
  }

  getSensorHistory() {
    return async (dispatch, getState) => {
      // Sensor history
      const {
        nest: {
          sensorHistoryDateParams: { startTimestamp, endTimestamp },
        },
      } = getState();

      dispatch(setSensorHistoryLoading(true));

      const response = await this.nestApi.getSensorHistory(
        startTimestamp,
        endTimestamp
      );

      response.status === 200
        ? dispatch(setSensorHistory(response.data))
        : dispatch(popErrorMessage('Failed to fetch sensor info'));

      dispatch(setSensorHistoryLoading(false));
    };
  }

  getSensorInfo() {
    return async (dispatch, getState) => {
      dispatch(setSensorInfoLoading(true));

      const response = await this.nestApi.getSensorInfo();

      response.status === 200
        ? dispatch(setSensorInfo(response.data))
        : dispatch(popErrorMessage('Failed to fetch sensor info'));

      dispatch(setSensorInfoLoading(false));
    };
  }
}

export const { getSensorHistory, getSensorInfo } = new NestActions();
