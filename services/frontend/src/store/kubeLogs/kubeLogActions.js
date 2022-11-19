import autoBind from 'auto-bind';
import KubeLogsApi from '../../api/kubeLogsApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setLogs,
  setNamespaces,
  setPods,
  setSelectedNamespacePods,
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

  getLogs(namespace, pod) {
    return async (dispatch, getState) => {
      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch logs for pod'));
        } else {
          dispatch(setLogs(data?.logs));
        }
      };

      const state = getState();
      // Get the number of log tail lines to fetch
      const logTail = state.kubeLogs.logTail;

      const response = await this.kubeLogsApi.getLogs(namespace, pod, logTail);
      handleResponse(response);
    };
  }
}

export const { getPods, getLogs, filterPodsByNamespace } = new KubeLogActions();
