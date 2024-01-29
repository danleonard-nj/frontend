import { createSlice } from '@reduxjs/toolkit';

const initialFeature = {
  description: 'This is a feature',
  feature_key: 'new-feature',
  name: 'New Feature',
  feature_type: 'boolean',
  value: true,
};

const initialState = {
  features: [],
  featuresFetched: false,
  featuresLoading: true,
  feature: initialFeature,
  featureFetched: false,
  featureLoading: false,
  editMode: true,
  editFeature: null,
  createFeatureOpen: false,
  createFeatureFetched: false,
  createdFeature: null,
  snackbar: {
    open: false,
    message: '',
    close: 6000,
  },
};

const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    setFeature(state, { payload }) {
      state.featureLoading = false;
      state.feature = payload;
    },
    setFeatureLoading(state, { payload }) {
      state.featureLoading = true;
    },
    setFeatures(state, { payload }) {
      state.features = payload;
    },
    setFeaturesLoading(state, { payload }) {
      state.featuresLoading = payload;
    },
    setCreateFeatureDialog(state, { payload }) {
      state.createFeatureOpen = payload;
    },
    updateFeature(state, { payload }) {
      state.feature = payload(state.feature);
    },
    createFeatureFetching(state) {
      state.createFeatureFetched = false;
    },
    createFeatureFetched(state, { payload }) {
      state.createFeatureFetched = true;
      state.createdFeature = payload;
    },
    openSnackbar(state, { payload }) {
      state.snackbar = payload;
    },
    updateFeatureListItem(state, { payload }) {
      state.features = state.features.map((feature) => {
        return feature.feature_id === payload.feature_id
          ? payload
          : feature;
      });
    },
  },
});

export const {
  setFeature,
  setFeatureLoading,
  setFeatures,
  setFeaturesLoading,
  featureFetching,
  updateFeatureListItem,
  featuresFetched,
  featuresFetching,
  setCreateFeatureDialog,
  updateFeature,
  createFeatureFetched,
  createFeatureFetching,
  openSnackbar,
} = featureSlice.actions;

export default featureSlice.reducer;
