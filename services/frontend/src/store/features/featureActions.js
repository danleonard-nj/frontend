import autoBind from 'auto-bind';
import FeatureApi from '../../api/features/featuresApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import { closeDialog, dialogType } from '../dialog/dialogSlice';
import {
  setFeature,
  setFeatureLoading,
  setFeatures,
  setFeaturesLoading,
} from './featureSlice';

const handleErrorMessage = (message, data) => {
  return 'message' in data ? `${message}: ${data}` : message;
};

export default class FeatureActions {
  constructor() {
    this.featureApi = new FeatureApi();
    autoBind(this);
  }

  getFeatures = () => {
    return async (dispatch, getState) => {
      dispatch(setFeaturesLoading(true));

      const handleErrorResponse = ({ data }) => {
        // Pop an error message if we failed to fetch
        // the feature list
        const errorMessage = handleErrorMessage(
          'Failed to fetch feature list',
          data
        );
        dispatch(popErrorMessage(errorMessage));
      };

      const response = await this.featureApi.getFeatures();

      response?.status === 200
        ? dispatch(setFeatures(response.data))
        : handleErrorResponse(response);

      dispatch(setFeaturesLoading(false));
    };
  };

  deleteFeature = (featureId) => {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data }) => {
        const errorMessage = handleErrorMessage(
          `Failed to delete feature with the ID '${featureId}'`,
          data
        );
        // Pop an error message if we failed to delete
        dispatch(popErrorMessage(errorMessage));
      };

      const response = await this.featureApi.deleteFeature(featureId);

      response?.status === 200
        ? dispatch(setFeature(response.data))
        : handleErrorResponse(response);
    };
  };

  createFeature = (feature) => {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data }) => {
        // Pop an error on failure to create the feature
        const errorMessage = handleErrorMessage(
          'Failed to create feature',
          data
        );
        dispatch(popErrorMessage(errorMessage));
      };

      const handleSuccessResponse = ({ data, status }) => {
        // Pop a success message
        dispatch(
          popMessage(`Feature '${data.feature_key}' created!`)
        );

        // Close dialog and reload feature list
        dispatch(closeDialog(dialogType.createFeatureDialog));
        dispatch(this.getFeatures());
      };

      dispatch(setFeatureLoading(true));

      const response = await this.featureApi.createFeature(feature);

      response?.status === 200
        ? handleSuccessResponse(response)
        : handleErrorResponse(response);
    };
  };

  updateFeatureValue = (featureKey, value) => {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data }) => {
        // Pop an error if we fail to set the feature value
        const errorMessage = handleErrorMessage(
          `Failed to get feature: ${featureKey}`,
          data
        );
        dispatch(popErrorMessage(errorMessage));
      };

      const handleSuccessResponse = () => {
        // Pop a success message and reload feature list
        dispatch(
          popMessage(`Feature '${featureKey}' updated successfully!`)
        );
        // Refresh features so list reflects new value
        dispatch(this.getFeatures());
      };

      const response = await this.featureApi.setFeature(
        featureKey,
        value
      );

      response?.status === 200
        ? handleSuccessResponse()
        : handleErrorResponse(response);
    };
  };
}

export const {
  updateFeatureValue,
  createFeature,
  deleteFeature,
  getFeatures,
} = new FeatureActions();
