import { createSlice } from '@reduxjs/toolkit';
import { requestType } from '../../api/data/chatGpt';

const defaultEngine = 'gpt-3.5-turbo';

const chatGptInitialState = {
  selectedRequestType: requestType.chat,
  prompt: '',
  prediction: '',
  message: '',
  chatMessages: [],
  chatMessagesLoading: false,
  predictionLoading: false,
  imagesLoading: false,
  usage: {},
  usageLoading: true,
  images: [],
  engines: [],
  enginesLoading: true,
  history: [],
  historyLoading: true,
  historyEndpoints: [],
  historyEndpointsLoading: true,
  historyDaysBack: 7,
  selectedHistoryEndpoint: '',
  selectedEngine: defaultEngine,
  tokens: 2048,
  imageRepetitions: 2,
  imageSize: '1024x1024',
  isConfigurationExpanded: true,
};

const chatReducers = {
  setChatMessages(state, { payload }) {
    state.chatMessages = payload;
  },
  setChatMessagesLoading(state, { payload }) {
    state.chatMessagesLoading = payload;
  },
  setMessage(state, { payload }) {
    state.message = payload;
  },
};

const historyReducers = {
  setHistory(state, { payload }) {
    state.history = payload;
  },
  setHistoryLoading(state, { payload }) {
    state.historyLoading = payload;
  },
  setHistoryEndpoints(state, { payload }) {
    state.historyEndpoints = payload;
    state.historyEndpointsLoading = false;
  },
  setHistoryEndpointsLoading(state, { payload }) {
    state.historyEndpointsLoading = payload;
  },
  setSelectedHistoryEndpoint(state, { payload }) {
    state.selectedHistoryEndpoint = payload;
  },
  setHistoryDaysBack(state, { payload }) {
    state.historyDaysBack = payload;
  },
};

const imageReducers = {
  setImages(state, { payload }) {
    state.images = payload;
    state.predictionLoading = false;
  },
  setImageRepetitions(state, { payload }) {
    state.imageRepetitions = payload;
  },
  setImageSize(state, { payload }) {
    state.imageSize = payload;
  },
};

const engineReducers = {
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
    setTokens(state, { payload }) {
      state.tokens = payload;
    },
    setSelectedRequestType(state, { payload }) {
      state.selectedRequestType = payload;
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
    ...historyReducers,
    ...imageReducers,
    ...engineReducers,
    ...chatReducers,
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
  setImageSize,
  setUsage,
  setUsageLoading,
  setConfigurationExpanded,
  setHistory,
  setHistoryLoading,
  setHistoryEndpoints,
  setHistoryEndpointsLoading,
  setSelectedHistoryEndpoint,
  setHistoryDaysBack,
  setChatMessages,
  setChatMessagesLoading,
  setMessage,
} = chatGptSlice.actions;

export default chatGptSlice.reducer;
