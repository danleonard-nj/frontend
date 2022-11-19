import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scenes: [],
  scenesLoading: true,
  scene: null,
  sceneLoading: true,
  sceneCategories: [],
  sceneCategoriesLoading: true,
  isNew: false,
  filteredScenes: [],
  selectedSceneCategory: '',
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    setFilteredScenes(state, { payload }) {
      state.filteredScenes = payload;
    },
    setScenes(state, { payload }) {
      state.scenes = payload;
      state.scenesLoading = false;
    },
    setScenesLoading(state, { payload }) {
      state.scenesLoading = true;
    },
    setScene(state, { payload }) {
      state.scene = payload;
      state.sceneLoading = true;
    },
    setSceneCategories(state, { payload }) {
      state.sceneCategories = payload;
      state.sceneCategoriesLoading = false;
    },
    setIsNew(state, { payload }) {
      state.isNew = payload;
    },
    updateSceneStateInternal(state, { payload }) {
      state.scene = payload;
    },
    setSelectedSceneCategory(state, { payload }) {
      state.selectedSceneCategory = payload;
    },
  },
});

export const {
  setSelectedSceneCategory,
  updateSceneStateInternal,
  setIsNew,
  setSceneCategories,
  setScene,
  setScenesLoading,
  setScenes,
  setFilteredScenes,
} = sceneSlice.actions;

export default sceneSlice.reducer;
