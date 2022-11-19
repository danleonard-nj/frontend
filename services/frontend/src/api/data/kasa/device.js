const deviceTypes = {
  SmartPlug: 'IOT.SMARTPLUGSWITCH',
  SmartLight: 'IOT.SMARTBULB',
};

const defaultDevice = {
  device_id: '',
  device_name: '',
  device_type: '',
};

const deviceState = {
  devices: [],
  devicesLoading: true,
  deviceLoading: false,
  device: defaultDevice,
  deviceLoaded: false,
  deviceClientResponse: {},
  deviceClientResponseLoading: true,
};

export { deviceTypes, defaultDevice, deviceState };
