import FeatureApi from '../../api/features/featuresApi';
import {
  createFeatureFetched,
  createFeatureFetching,
  featuresFetched,
  featuresFetching,
  openSnackbar,
  setCreateFeatureDialog,
} from './featureSlice';

export function getFeatures() {
  return async (dispatch, getState) => {
    dispatch(featuresFetching());

    const api = new FeatureApi();
    const response = await api.getFeatures();

    dispatch(featuresFetched(response?.features));
  };
}

export function deleteFeature(featureId) {
  return async (dispatch, getState) => {
    const api = new FeatureApi();
    await api.deleteFeature(featureId);
    dispatch(getFeatures());
  };
}

export function createFeature() {
  return async (dispatch, getState) => {
    dispatch(createFeatureFetching());

    const state = getState();
    const api = new FeatureApi();
    const response = await api.createFeature(state.feature.feature);

    dispatch(createFeatureFetched(response));
    dispatch(
      openSnackbar({
        open: true,
        message: `Feature created! ID: ${response.feature_id}`,
      })
    );
    dispatch(getFeatures());
    dispatch(setCreateFeatureDialog(false));
  };
}

export function setFeature(featureKey, value) {
  return async (dispatch, getState) => {
    const api = new FeatureApi();
    await api.setFeature(featureKey, value);
  };
}
