import { deviceTypes } from './device';

const defaultPreset = {
  definition: {
    hue: 0,
    saturation: 0,
  },
};

const presetState = {
  presets: [],
  presetsLoading: true,
  preset: defaultPreset,
  presetLoading: false,
  isNewPreset: false,
};

const getColor = (hue, saturation) => {
  var newSaturation = saturation == 0 ? 0 : saturation / 100;
  return {
    h: hue,
    s: newSaturation,
    l: 0,
    a: 1,
  };
};

const getDefaultColor = () => {
  return { hsl: { h: 0, s: 0, l: 0 } };
};

const getNewPreset = (deviceType) => {
  return {
    definition:
      deviceType == deviceTypes.SmartLight
        ? {
            brightness: 0,
            hue: 0,
            saturation: 0,
            state: false,
            temperature: 0,
          }
        : { state: false },
    device_type: deviceType,
    preset_id: null,
    preset_name: '',
  };
};

export { getColor, getDefaultColor, getNewPreset, defaultPreset, presetState };
