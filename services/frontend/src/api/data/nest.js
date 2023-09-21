const nestCommandKeys = {
  setRange: 'set-range',
  setHeat: 'set-heat',
  setCool: 'set-cool',
  setPowerOff: 'set-power-off',
};

const nestCommandNameMapping = {
  SetRange: { name: 'Set Range', key: nestCommandKeys.setRange },
  SetHeat: { name: 'Set Heat', key: nestCommandKeys.setHeat },
  SetCool: { name: 'Set Cool', key: nestCommandKeys.setCool },
  SetPowerOff: {
    name: 'Set Power Off',
    key: nestCommandKeys.setPowerOff,
  },
};

const thermostatModeNameMapping = {
  OFF: 'Off',
  COOL: 'Cool',
  HEAT: 'Heat',
};

const thermostatConnectivityMapping = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
};

const hvacStatusNameMapping = {
  OFF: 'Off',
  COOLING: 'Cooling',
  HEATING: 'Heating',
};

const rangeMarks = [
  {
    value: 62,
    label: '62°C',
  },
  {
    value: 66,
    label: '66°C',
  },
  {
    value: 70,
    label: '70°C',
  },
  {
    value: 74,
    label: '74°C',
  },
  {
    value: 78,
    label: '78°C',
  },
];

const transformDeviceHistoryData = (data) => {
  return data.map((row) => ({
    ...row,
    id: row.record_id,
    timestamp: new Date(row.timestamp * 1000).toLocaleString(),
    humidity_percent: `${row.humidity_percent.toFixed(2)} %`,
  }));
};

const transformIntegrationEventData = (data) => {
  return data.map((row) => ({
    ...row,
    id: row.event_id,
    timestamp: new Date(row.timestamp * 1000).toLocaleString(),
  }));
};

export {
  nestCommandNameMapping,
  nestCommandKeys,
  rangeMarks,
  thermostatModeNameMapping,
  thermostatConnectivityMapping,
  hvacStatusNameMapping,
  transformDeviceHistoryData,
  transformIntegrationEventData,
};
