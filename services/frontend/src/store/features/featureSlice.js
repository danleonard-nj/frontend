import { createSlice } from '@reduxjs/toolkit';

const initialFeature = {
  description: 'This is a feature',
  feature_key: 'new-feature',
  name: 'New Feature',
  type_id: 1,
  type_name: 'BOOLEAN',
  value: true,
};

const initialState = {
  features: [],
  featuresFetched: false,
  feature: initialFeature,
  featureFetched: false,
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
    featureFetched(state, { payload }) {
      state.featureFetched = true;
      state.feature = payload;
    },
    featuresFetched(state, { payload }) {
      state.featuresFetched = true;
      state.features = payload;
    },
    featureFetching(state) {
      state.featureFetched = false;
    },
    featuresFetching(state) {
      state.featureFetched = false;
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
        return feature.feature_id == payload.feature_id ? payload : feature;
      });
    },
  },
});

export const {
  featureFetched,
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
