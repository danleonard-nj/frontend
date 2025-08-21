import { createSlice } from '@reduxjs/toolkit';

const kubeLogsInitalState = {
  logsLoading: true,
  logs: [],
  podsLoading: true,
  pods: [],
  namespaces: [],
  namespacesLoading: true,
  selectedNamespacePods: [],
  selectedNamespacePodsLoading: true,
  selectedNamespace: '',
  selectedPod: '',
  selectedLogsTab: 0,
  logTail: 5000,
  isStreaming: false,
  streamingInterval: 5000,
  lastLogTimestamp: null,
  accumulatedLogs: [],
};

const kubeLogsSlice = createSlice({
  name: 'kubeLogs',
  initialState: kubeLogsInitalState,
  reducers: {
    setLogs(state, { payload }) {
      state.logs = payload;
    },
    appendLogs(state, { payload }) {
      state.logs = [...state.logs, ...payload];
      state.accumulatedLogs = [...state.accumulatedLogs, ...payload];
    },
    setLogsLoading(state, { payload }) {
      state.logsLoading = payload;
    },
    setPods(state, { payload }) {
      state.pods = payload;
      state.podsLoading = false;
    },
    setNamespaces(state, { payload }) {
      state.namespaces = payload;
      state.namespacesLoading = false;
    },
    setSelectedNamespace(state, { payload }) {
      state.selectedNamespace = payload;
    },
    setSelectedNamespacePods(state, { payload }) {
      state.selectedNamespacePods = payload;
      state.selectedNamespacePodsLoading = false;
    },
    setSelectedLogsTab(state, { payload }) {
      state.selectedLogsTab = payload;
    },
    setLogTail(state, { payload }) {
      state.logTail = payload;
    },
    setSelectedPod(state, { payload }) {
      state.selectedPod = payload;
    },
    setIsStreaming(state, { payload }) {
      state.isStreaming = payload;
    },
    setStreamingInterval(state, { payload }) {
      state.streamingInterval = payload;
    },
    setLastLogTimestamp(state, { payload }) {
      state.lastLogTimestamp = payload;
    },
    clearAccumulatedLogs(state) {
      state.accumulatedLogs = [];
      state.logs = [];
    },
  },
});

export const {
  setLogs,
  appendLogs,
  setSelectedNamespace,
  setPods,
  setNamespaces,
  setSelectedNamespacePods,
  setSelectedLogsTab,
  setLogTail,
  setSelectedPod,
  setLogsLoading,
  setIsStreaming,
  setStreamingInterval,
  setLastLogTimestamp,
  clearAccumulatedLogs,
} = kubeLogsSlice.actions;

export default kubeLogsSlice.reducer;
