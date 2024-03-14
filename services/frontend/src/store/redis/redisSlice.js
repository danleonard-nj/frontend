import { createSlice } from '@reduxjs/toolkit';

const redisSliceInitialState = {
  redisKeys: [],
  redisKeysLoading: true,
  cacheValues: {},
  redisDiagnostics: {},
  redisDiagnosticsLoading: false,
  selectedKey: '',
  cacheValueLoading: false,
  cacheValue: {},
};

const redisSlice = createSlice({
  name: 'redis',
  initialState: redisSliceInitialState,
  reducers: {
    setRedisKeys(state, { payload }) {
      state.redisKeys = payload;
    },
    setRedisKeysLoading(state, { payload }) {
      state.redisKeysLoading = payload;
    },
    setRedisDiagnostics(state, { payload }) {
      state.redisDiagnostics = payload;
    },
    setRedisDiagnosticsLoading(state, { payload }) {
      state.redisDiagnosticsLoading = payload;
    },
    setSelectedKey(state, { payload }) {
      state.selectedKey = payload;
    },
    setCacheValue(state, { payload }) {
      state.cacheValue = payload;
    },
    setCacheValueLoading(state, { payload }) {
      state.cacheValueLoading = payload;
    },
    setParseJson(state, { payload }) {
      state.parseJson = payload;
    },
  },
});

export const {
  setRedisKeys,
  setRedisKeysLoading,
  setRedisDiagnostics,
  setRedisDiagnosticsLoading,
  setSelectedKey,
  setCacheValue,
  setCacheValueLoading,
  setParseJson,
} = redisSlice.actions;

export default redisSlice.reducer;
