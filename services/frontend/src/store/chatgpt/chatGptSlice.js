import { createSlice } from '@reduxjs/toolkit';
import { requestType } from '../../api/data/chatGpt';

const defaultEngine = 'text-davinci-003';

const chatGptInitialState = {
  selectedRequestType: requestType.completion,
  prompt: '',
  prediction: '',
  predictionLoading: false,
  imagesLoading: false,
  usage: {},
  usageLoading: true,
  images: [],
  engines: [],
  selectedEngine: defaultEngine,
  enginesLoading: true,
  tokens: 2048,
  imageRepetitions: 2,
  imageSize: '1024x1024',
  isConfigurationExpanded: true,
};

const chatGptSlice = createSlice({
  name: 'chatGpt',
  initialState: chatGptInitialState,
  reducers: {
    setPrompt(state, { payload }) {
      state.prompt = payload;
    },
    setPrediction(state, { payload }) {
      state.prediction = payload;
      state.predictionLoading = false;
    },
    setPredictionLoading(state, { payload }) {
      state.predictionLoading = payload;
    },
    setImages(state, { payload }) {
      state.images = payload;
      state.predictionLoading = false;
    },
    setEngines(state, { payload }) {
      state.engines = payload;
      state.enginesLoading = false;
    },
    setEnginesLoading(state, { payload }) {
      state.enginesLoading = payload;
    },
    setSelectedEngine(state, { payload }) {
      state.selectedEngine = payload;
    },
    setTokens(state, { payload }) {
      state.tokens = payload;
    },
    setSelectedRequestType(state, { payload }) {
      state.selectedRequestType = payload;
    },
    setImageRepetitions(state, { payload }) {
      state.imageRepetitions = payload;
    },
    setUsage(state, { payload }) {
      state.usage = payload;
      state.usageLoading = false;
    },
    setUsageLoading(state, { payload }) {
      state.usageLoading = payload;
    },
    setConfigurationExpanded(state, { payload }) {
      state.isConfigurationExpanded = payload;
    },
  },
});

export const {
  setPrompt,
  setPrediction,
  setPredictionLoading,
  setImages,
  setImagesLoading,
  setEngines,
  setEnginesLoading,
  setSelectedEngine,
  setTokens,
  setSelectedRequestType,
  setImageRepetitions,
  setUsage,
  setUsageLoading,
  setConfigurationExpanded,
} = chatGptSlice.actions;

export default chatGptSlice.reducer;
