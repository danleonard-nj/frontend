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
    value: 60,
    label: '60°C',
  },
  {
    value: 68,
    label: '68°C',
  },
  {
    value: 72,
    label: '72°C',
  },
  {
    value: 76,
    label: '76°C',
  },
  {
    value: 80,
    label: '80°C',
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
