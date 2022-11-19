import { createSlice } from '@reduxjs/toolkit';
import { deviceState } from '../../api/data/kasa/device';

const deviceSlice = createSlice({
  name: 'device',
  initialState: deviceState,
  reducers: {
    setDevicesLoading(state) {
      state.devicesLoading = true;
    },
    setDevices(state, { payload }) {
      state.devices = payload;
      state.devicesLoading = false;
    },
    setDeviceLoading(state) {
      state.deviceLoading = true;
    },
    setRegions(state, { payload }) {
      state.regions = payload;
      state.regionsLoading = false;
    },
    setRegionsLoading(state) {
      state.regionsLoading = true;
    },
    setDevice(state, { payload }) {
      state.device = payload;
      state.deviceLoading = false;
    },
    setDeviceClientResponse(state, { payload }) {
      state.deviceClientResponse = payload;
      state.deviceClientResponseLoading = false;
    },
    setDeviceClientLoading(state) {
      state.deviceClientResponseLoading = true;
    },
  },
});

export const {
  setDevicesLoading,
  setDevices,
  setDevice,
  setDeviceLoading,
  setRegions,
  setRegionsLoading,
  setDeviceClientResponse,
  setDeviceClientLoading,
} = deviceSlice.actions;

export default deviceSlice.reducer;
