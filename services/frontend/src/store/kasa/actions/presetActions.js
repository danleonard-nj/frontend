import autoBind from 'auto-bind';
import {
  getErrorMessage,
  sortBy,
} from '../../../api/helpers/apiHelpers';
import PresetApi from '../../../api/kasa/presetApi';
import { popErrorMessage } from '../../alert/alertActions';
import {
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
      const handleErrorResponse = ({ status, data }) => {
        const message = getErrorMessage(data);
        dispatch(
          popErrorMessage(`Failed to fetch presets: ${message}`)
        );
      };

      dispatch(setPresetsLoading(true));
      const response = await this.presetApi.getPresets();

      const sortedPresets = sortBy(response?.data, 'preset_name');

      response.status === 200
        ? dispatch(setPresets(sortedPresets))
        : handleErrorResponse(response);
    };
  }

  deletePreset() {
    return async (dispatch, getState) => {
      const state = getState();
      const presetId = state.preset.preset.preset_id;

      dispatch(setPresetsLoading(true));
      await this.presetApi.deletePreset(presetId);

      dispatch(this.getPresets());
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

      dispatch(this.getPresets());
    };
  }
}

export const { savePreset, deletePreset, getPresets, getPreset } =
  new KasaPresetActions();
