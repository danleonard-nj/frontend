import autoBind from 'auto-bind';
import PresetApi from '../../../api/kasa/presetApi';
import { popErrorMessage } from '../../alert/alertActions';
import { getErrorMessage } from '../../../api/helpers/apiHelpers';
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

      const handleErrorResponse = ({ data }) => {
        dispatch(
          popErrorMessage(
            `Failed to fetch presets: ${getErrorMessage(data)}`
          )
        );
      };

      const response = await this.presetApi.getPresets();

      response?.status === 200
        ? dispatch(setPresets(response.data?.presets))
        : handleErrorResponse(response);
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
