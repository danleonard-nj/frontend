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
  logTail: 250,
};

const kubeLogsSlice = createSlice({
  name: 'kubeLogs',
  initialState: kubeLogsInitalState,
  reducers: {
    setLogs(state, { payload }) {
      state.logs = payload;
      state.logsLoading = false;
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
  },
});

export const {
  setLogs,
  setSelectedNamespace,
  setPods,
  setNamespaces,
  setSelectedNamespacePods,
  setSelectedLogsTab,
  setLogTail,
  setSelectedPod,
} = kubeLogsSlice.actions;

export default kubeLogsSlice.reducer;
