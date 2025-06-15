// services/frontend/src/store/calendar/calendarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const calendarInitialState = {
  prompt: '',
  images: [],
  generatedEvent: null,
  isGenerating: false,
  isSaving: false,
  lastSavedEvent: null,
  error: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: calendarInitialState,
  reducers: {
    setPrompt(state, { payload }) {
      state.prompt = payload;
    },
    setImages(state, { payload }) {
      state.images = payload;
    },
    addImage(state, { payload }) {
      state.images.push(payload);
    },
    removeImage(state, { payload }) {
      state.images = state.images.filter((img) => img.id !== payload);
    },
    clearImages(state) {
      state.images = [];
    },
    setGeneratedEvent(state, { payload }) {
      state.generatedEvent = payload;
    },
    setIsGenerating(state, { payload }) {
      state.isGenerating = payload;
    },
    setIsSaving(state, { payload }) {
      state.isSaving = payload;
    },
    setLastSavedEvent(state, { payload }) {
      state.lastSavedEvent = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
    resetCalendar(state) {
      return calendarInitialState;
    },
  },
});

export const {
  setPrompt,
  setImages,
  addImage,
  removeImage,
  clearImages,
  setGeneratedEvent,
  setIsGenerating,
  setIsSaving,
  setLastSavedEvent,
  setError,
  clearError,
  resetCalendar,
} = calendarSlice.actions;

export default calendarSlice.reducer;
