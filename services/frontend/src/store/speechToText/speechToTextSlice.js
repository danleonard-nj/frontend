import { createSlice } from '@reduxjs/toolkit';

const speechToTextInitialState = {
  message: '',
  isRecording: false,
  isTranscribing: false,
  transcriptionHistory: [],
  transcriptionHistoryLoading: false,
  error: null,
  lastTranscription: null,
};

const speechToTextSlice = createSlice({
  name: 'speechToText',
  initialState: speechToTextInitialState,
  reducers: {
    setMessage(state, { payload }) {
      state.message = payload;
    },
    appendToMessage(state, { payload }) {
      state.message = state.message
        ? `${state.message} ${payload}`
        : payload;
    },
    clearMessage(state) {
      state.message = '';
    },
    setIsRecording(state, { payload }) {
      state.isRecording = payload;
    },
    setIsTranscribing(state, { payload }) {
      state.isTranscribing = payload;
    },
    setTranscriptionHistory(state, { payload }) {
      state.transcriptionHistory = payload;
    },
    setTranscriptionHistoryLoading(state, { payload }) {
      state.transcriptionHistoryLoading = payload;
    },
    addToHistory(state, { payload }) {
      state.transcriptionHistory = [
        payload,
        ...state.transcriptionHistory,
      ];
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
    setLastTranscription(state, { payload }) {
      state.lastTranscription = payload;
    },
  },
});

export const {
  setMessage,
  appendToMessage,
  clearMessage,
  setIsRecording,
  setIsTranscribing,
  setTranscriptionHistory,
  setTranscriptionHistoryLoading,
  addToHistory,
  setError,
  clearError,
  setLastTranscription,
} = speechToTextSlice.actions;

export default speechToTextSlice.reducer;
