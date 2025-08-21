import autoBind from 'auto-bind';
import KubeLogsApi from '../../api/kubeLogsApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setLogs,
  appendLogs,
  setLogsLoading,
  setNamespaces,
  setPods,
  setSelectedNamespacePods,
  setLastLogTimestamp,
} from './kubeLogSlice';

export default class KubeLogActions {
  constructor() {
    this.kubeLogsApi = new KubeLogsApi();
    autoBind(this);
  }

  getNamespaces(pods) {
    const namespaces = [];
    for (const pod of pods) {
      if (!namespaces.includes(pod.namespace)) {
        namespaces.push(pod.namespace);
      }
    }

    return namespaces;
  }

  filterPodsByNamespace(namespace) {
    return async (dispatch, getState) => {
      const state = getState();
      const pods = state.kubeLogs.pods?.filter(
        (x) => x.namespace === namespace
      );

      dispatch(setSelectedNamespacePods(pods));
    };
  }

  getPods() {
    return async (dispatch, getState) => {
      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          // Throw on failure response
          dispatch(
            popErrorMessage(
              'Failed to fetch pods and namespaces from Azure gateway'
            )
          );
        } else {
          // Get distinct namespace list
          const pods = data?.pods;
          console.log(pods);
          const namespaces = this.getNamespaces(pods);
          dispatch(setNamespaces(namespaces));
          dispatch(setPods(pods));
        }
      };

      // Fetch pod list from Azure gateway, also
      // used to generate namespace list
      const response = await this.kubeLogsApi.getPods();
      handleResponse(response);
    };
  }

  getLogs(namespace, pod, append = false) {
    return async (dispatch, getState) => {
      dispatch(setLogsLoading(true));

      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch logs for pod'));
        } else {
          const logs = data?.logs || [];

          if (append && logs.length > 0) {
            // When appending, only add new logs
            dispatch(appendLogs(logs));
          } else {
            // When not appending, replace all logs
            dispatch(setLogs(logs));
          }

          // Update last log timestamp if logs exist
          if (logs.length > 0) {
            const lastLog = logs[logs.length - 1];
            // Extract timestamp from log if available
            const timestampMatch = lastLog.match(
              /^(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})?)/
            );
            if (timestampMatch) {
              dispatch(setLastLogTimestamp(timestampMatch[1]));
            } else {
              dispatch(setLastLogTimestamp(new Date().toISOString()));
            }
          }
        }
      };

      // Get the number of log tail lines to fetch
      const {
        kubeLogs: { logTail = 0 },
      } = getState();

      const response = await this.kubeLogsApi.getLogs(
        namespace,
        pod,
        logTail
      );

      handleResponse(response);
      dispatch(setLogsLoading(false));
    };
  }
}

export const {
  getPods,
  getLogs,
  // getLogsWithTimestamp,
  filterPodsByNamespace,
} = new KubeLogActions();
