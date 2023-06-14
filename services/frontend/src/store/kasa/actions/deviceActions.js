import autoBind from 'auto-bind';
import {
  getErrorMessage,
  sortBy,
} from '../../../api/helpers/apiHelpers';
import DeviceApi from '../../../api/kasa/deviceApi';
import {
  popErrorMessage,
  popMessage,
} from '../../alert/alertActions';
import {
  setDevice,
  setDeviceClientResponse,
  setDevices,
  setRegions,
  setRegionsLoading,
} from '../deviceSlice';

export default class KasaDeviceActions {
  constructor() {
    this.deviceApi = new DeviceApi();
    autoBind(this);
  }

  getDevice = (deviceId) => {
    return async (dispatch, getState) => {
      const response = await this.deviceApi.getDevice(deviceId);

      dispatch(
        response.status === 200
          ? setDevice(response?.data)
          : popErrorMessage('Failed to fetch device')
      );
    };
  };

  getDeviceClientResponse = (deviceId) => {
    return async (dispatch, getState) => {
      const response = await this.deviceApi.getDeviceClientResponse(
        deviceId
      );

      dispatch(
        response.status === 200
          ? setDeviceClientResponse(response?.data)
          : popErrorMessage('Failed to fetch device client response')
      );
    };
  };

  updateDevice = () => {
    return async (dispatch, getState) => {
      const state = getState();
      const device = state.device.device;

      const handleSuccess = ({ status, data }) => {
        // On update success
        dispatch(popMessage('Device updated successfully'));
        dispatch(this.getDevices());
      };

      const response = await this.deviceApi.updateDevice(device);

      response.status === 200
        ? handleSuccess(response)
        : dispatch(
            popErrorMessage(
              `Failed to update device: ${getErrorMessage(
                response?.data
              )}`
            )
          );
    };
  };

  getDevices = () => {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ status, data }) => {
        dispatch(
          popErrorMessage(
            `Failed to fetch device list: ${getErrorMessage(data)}`
          )
        );
      };

      const response = await this.deviceApi.getDevices();
      const sortedDevices = sortBy(response.data, 'device_name');

      response.status === 200
        ? dispatch(setDevices(sortedDevices))
        : handleErrorResponse(response);
    };
  };

  getRegions = () => {
    return async (dispatch, getState) => {
      dispatch(setRegionsLoading());
      const response = await this.deviceApi.getRegions();
      const regions = response?.data;
      dispatch(setRegions(regions));
    };
  };

  syncDevices = () => {
    return async (dispatch, getState) => {
      const response = await this.deviceApi.syncDevices();
      const syncedDevices = response?.data;
      dispatch(setDevices(syncedDevices));
    };
  };
}

export const {
  syncDevices,
  getDevices,
  getDevice,
  getRegions,
  updateDevice,
  getDeviceClientResponse,
} = new KasaDeviceActions();
