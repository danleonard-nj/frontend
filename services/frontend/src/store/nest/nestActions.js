import autoBind from 'auto-bind';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import NestApi from '../../api/nestApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setSensorInfo,
  setSensorInfoLoading,
  setThermostatInfo,
} from './nestSlice';

export default class NestActions {
  constructor() {
    this.nestApi = new NestApi();
    autoBind(this);
  }

  getSensorInfo() {
    return async (dispatch, getState) => {
      const handleErrorResultMessage = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(
              `Failed to fetch Nest sensor info: ${getErrorMessage(
                data
              )}`
            )
          );
        }
      };

      const response = await this.nestApi.getSensorInfo();

      response.status === 200
        ? dispatch(setSensorInfo(response.data))
        : handleErrorResultMessage(response);
    };
  }

  getThermostatInfo() {
    return async (dispatch, getState) => {
      const handleErrorResultMessage = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(
              `Failed to fetch Nest thermostat info: ${getErrorMessage(
                data
              )}`
            )
          );
        }
      };

      const response = await this.nestApi.getThermostatInfo();

      response.status === 200
        ? dispatch(setThermostatInfo(response.data))
        : handleErrorResultMessage(response);
    };
  }
}

export const { getSensorInfo, getThermostatInfo } = new NestActions();
