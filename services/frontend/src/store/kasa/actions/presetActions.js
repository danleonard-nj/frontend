import autoBind from 'auto-bind';
import {
  getErrorMessage,
  sortBy,
} from '../../../api/helpers/apiHelpers';
import PresetApi from '../../../api/kasa/presetApi';
import {
  popErrorMessage,
  popMessage,
} from '../../alert/alertActions';
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

      const sortedPresets = sortBy(
        response?.data?.presets,
        'preset_name'
      );

      response.status === 200
        ? dispatch(setPresets(sortedPresets))
        : handleErrorResponse(response);
    };
  }

  deletePreset(presetId) {
    return async (dispatch, getState) => {
      const state = getState();
      const presetId = state.preset.preset.preset_id;

      if (!presetId) {
        throw new Error('No preset is currently selected');
      }

      dispatch(setPresetsLoading(true));
      await this.presetApi.deletePreset(presetId);

      const presets = await this.presetApi.getPresets();
      dispatch(setPresets(presets?.data?.presets));
    };
  }

  savePreset(toSave) {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        status === 200
          ? dispatch(popMessage('Preset saved successfully'))
          : dispatch(popErrorMessage('Failed to save preset'));
      };

      const { isNewPreset, preset } = getState().preset;
      preset ??= toSave;

      // Update or create preset
      const { status } = isNewPreset
        ? await this.presetApi.createPreset(toSave ?? preset)
        : await this.presetApi.updatePreset(toSave ?? preset);

      handleResultMessage(status);

      // Flip the new flag
      if (isNewPreset) {
        dispatch(setNewPreset(false));
      }

      const presets = await this.presetApi.getPresets();
      dispatch(setPresets(presets?.data?.presets));
    };
  }
}

export const { savePreset, deletePreset, getPresets, getPreset } =
  new KasaPresetActions();
