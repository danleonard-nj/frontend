import autoBind from 'auto-bind';
import NestApi from '../../api/nestApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setAnalyticsData,
  setAnalyticsDataLoading,
  setCommandLoading,
  setCommands,
  setCommandsLoading,
  setEvents,
  setEventsLoading,
  setSensorHistory,
  setSensorHistoryLoading,
  setSensorInfo,
  setSensorInfoLoading,
  setThermosat,
  setThermosatLoading,
} from './nestSlice';
import { nestCommandKeys } from '../../api/data/nest';

export default class NestActions {
  constructor() {
    this.nestApi = new NestApi();
    autoBind(this);
  }

  getSensorHistory(sensorId, hoursBack) {
    return async (dispatch, getState) => {
      // Sensor history

      console.log('setting sensor history loading');
      dispatch(setSensorHistoryLoading(true));

      const response = await this.nestApi.getSensorHistory(
        sensorId,
        hoursBack
      );

      console.log('sensor history response', response);

      response.status === 200
        ? dispatch(setSensorHistory(response.data))
        : dispatch(popErrorMessage('Failed to fetch sensor info'));

      dispatch(setSensorHistoryLoading(false));
    };
  }

  getAnalyticsData(hoursBack, sample, devices) {
    return async (dispatch, getState) => {
      console.log('getting analytics data');

      dispatch(setAnalyticsDataLoading(true));

      // Fetch sensor history for display
      const response = await this.nestApi.getHistory(
        hoursBack,
        sample,
        devices
      );

      console.log('analytics data response', response);

      response.status === 200
        ? dispatch(setAnalyticsData(response.data))
        : dispatch(
            popErrorMessage(
              'Failed to fetch sensory history data for analytics'
            )
          );

      dispatch(setAnalyticsDataLoading(false));
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

  getThermostat() {
    return async (dispatch, getState) => {
      dispatch(setThermosatLoading(true));

      const response = await this.nestApi.getThermostat();

      response.status === 200
        ? dispatch(setThermosat(response.data))
        : dispatch(
            popErrorMessage('Failed to fetch thermostat info')
          );

      dispatch(setThermosatLoading(false));
    };
  }

  getThermostatCommands() {
    return async (dispatch, getState) => {
      dispatch(setCommandsLoading(true));

      const { data, status } =
        await this.nestApi.getThermostatCommands();

      // Don't display the set-mode command
      const commands = data.filter(
        (x) => x.key !== nestCommandKeys.setMode
      );

      status === 200
        ? dispatch(setCommands(commands))
        : dispatch(
            popErrorMessage('Failed to fetch thermostat commands')
          );

      dispatch(setCommandsLoading(false));
    };
  }

  getIntegrationEvents(daysBack) {
    return async (dispatch, getState) => {
      dispatch(setEventsLoading(true));

      const response = await this.nestApi.getIntegrationEvents(
        daysBack
      );

      response.status === 200
        ? dispatch(setEvents(response.data))
        : dispatch(
            popErrorMessage('Failed to fetch integration events')
          );

      dispatch(setEventsLoading(false));
    };
  }

  sendThermostatCommand(key) {
    return async (dispatch, getState) => {
      dispatch(setCommandLoading(true));

      const { commandParameters } = getState().nest;

      const commandRequest = {
        command_type: key,
        params: commandParameters,
      };

      const response = await this.nestApi.postThermostatCommand(
        commandRequest
      );

      dispatch(this.getThermostat());

      response.status === 200
        ? dispatch(popMessage('Command sent successfully'))
        : dispatch(
            popErrorMessage(
              `Failed to send thermostat command: ${response.status}`
            )
          );

      dispatch(setCommandLoading(false));
    };
  }
}

export const {
  getSensorHistory,
  getSensorInfo,
  getThermostat,
  getThermostatCommands,
  sendThermostatCommand,
  getIntegrationEvents,
  getAnalyticsData,
} = new NestActions();
