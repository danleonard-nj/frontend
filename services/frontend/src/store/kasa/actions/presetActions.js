import autoBind from 'auto-bind';
import PresetApi from '../../../api/kasa/presetApi';
import {
  presetLoading,
  presetsLoading as setPresetsLoading,
  setNewPreset,
  setPreset,
  setPresets,
} from '../presetSlice';

export default class KasaPresetActions {
  constructor() {
    this.presetApi = new PresetApi();
    autoBind(this);
  }

  getPreset(presetId) {
    return async (dispatch, getState) => {
      const preset = await this.presetApi.getPreset(presetId);
      dispatch(setPreset(preset?.data));
    };
  }

  getPresets() {
    return async (dispatch, getState) => {
      dispatch(setPresetsLoading(true));
      const presets = await this.presetApi.getPresets();
      console.log(presets);
      dispatch(setPresets(presets?.data?.presets));
    };
  }

  deletePreset() {
    return async (dispatch, getState) => {
      const state = getState();
      const presetId = state.preset.preset.preset_id;

      if (!presetId) {
        throw new Error('No preset is currently selected');
      }

      dispatch(setPresetsLoading(true));
      await this.presetApi.deletePreset(presetId);

      const presets = await this.presetApi.getPresets();
      dispatch(setPresets(presets));
    };
  }

  savePreset(toSave) {
    return async (dispatch, getState) => {
      const state = getState();
      const preset = toSave ?? state.preset.preset;

      if (state.preset.isNewPreset) {
        await this.presetApi.createPreset(preset);
        dispatch(setNewPreset(false));
      } else {
        await this.presetApi.updatePreset(preset);
      }

      const presets = await this.presetApi.getPresets();
      dispatch(setPresets(presets));
    };
  }
}

export const { savePreset, deletePreset, getPresets, getPreset } =
  new KasaPresetActions();
