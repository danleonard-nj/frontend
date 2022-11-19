import autoBind from 'auto-bind';
import DeviceApi from '../../../api/kasa/deviceApi';
import { popErrorMessage, popMessage } from '../../alert/alertActions';
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
      const response = await this.deviceApi.getDeviceClientResponse(deviceId);

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
      if (!device) {
        throw new Error('Device cannot be null');
      }

      const response = await this.deviceApi.updateDevice(device);

      dispatch(
        response.status === 200
          ? popMessage('Device updated successfully')
          : popErrorMessage('Failed to update device')
      );
    };
  };

  getDevices = () => {
    return async (dispatch, getState) => {
      const response = await this.deviceApi.getDevices();
      console.log(response);

      dispatch(
        response.status === 200
          ? setDevices(response?.data?.devices)
          : popErrorMessage('Failed to upload device')
      );
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
