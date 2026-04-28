import { createSlice } from '@reduxjs/toolkit';

const speechToTextInitialState = {
  message: '',
  isRecording: false,
  isTranscribing: false,
  transcriptionHistory: [],
  transcriptionHistoryLoading: false,
  error: null,
  lastTranscription: null,
  lastTranscriptionId: null,
  diarizeEnabled: false,
  waveformEnabled: true,
  waveformOverlay: null,
  provider: 'default',
  polishEnabled: false,
  currentAudioFile: null,
  transcriptionSegments: null,
  audioCurrentTime: 0,
  activeSegmentIndex: -1,
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
    setLastTranscriptionId(state, { payload }) {
      state.lastTranscriptionId = payload;
    },
    setDiarizeEnabled(state, { payload }) {
      state.diarizeEnabled = payload;
    },
    setCurrentAudioFile(state, { payload }) {
      state.currentAudioFile = payload;
    },
    setTranscriptionSegments(state, { payload }) {
      state.transcriptionSegments = payload;
    },
    setAudioCurrentTime(state, { payload }) {
      state.audioCurrentTime = payload;
    },
    setActiveSegmentIndex(state, { payload }) {
      state.activeSegmentIndex = payload;
    },
    setWaveformEnabled(state, { payload }) {
      state.waveformEnabled = payload;
    },
    setWaveformOverlay(state, { payload }) {
      state.waveformOverlay = payload;
    },
    setProvider(state, { payload }) {
      state.provider = payload;
    },
    setPolishEnabled(state, { payload }) {
      state.polishEnabled = payload;
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
  setLastTranscriptionId,
  setDiarizeEnabled,
  setCurrentAudioFile,
  setTranscriptionSegments,
  setAudioCurrentTime,
  setActiveSegmentIndex,
  setWaveformEnabled,
  setWaveformOverlay,
  setProvider,
  setPolishEnabled,
} = speechToTextSlice.actions;

export default speechToTextSlice.reducer;
