import { createSlice } from '@reduxjs/toolkit';

const chatGptInitialState = {
  prompt: '',
  prediction: '',
  predictionLoading: false,
  engines: [],
  enginesLoading: true,
  tokens: 2048,
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
    setEngines(state, { payload }) {
      state.engines = payload;
      state.enginesLoading = false;
    },
    setEnginesLoading(state, { payload }) {
      state.enginesLoading = payload;
    },
    setTokens(state, { payload }) {
      state.tokens = payload;
    },
  },
});

export const {
  setPrompt,
  setPrediction,
  setPredictionLoading,
  setEngines,
  setEnginesLoading,
  setTokens,
} = chatGptSlice.actions;

export default chatGptSlice.reducer;
