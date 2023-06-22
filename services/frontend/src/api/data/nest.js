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

const rangeMarks = [
  {
    value: 65,
    label: '65°C',
  },
  {
    value: 70,
    label: '68°C',
  },
  {
    value: 75,
    label: '70°C',
  },
  {
    value: 80,
    label: '72°C',
  },
];

export { nestCommandNameMapping, nestCommandKeys, rangeMarks };
