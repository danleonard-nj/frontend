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

export {
  nestCommandNameMapping,
  nestCommandKeys,
  rangeMarks,
  thermostatModeNameMapping,
  thermostatConnectivityMapping,
  hvacStatusNameMapping,
};
