import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class KubeLogsApi extends ApiBase {
  constructor() {
    super(serviceScopes.azureGateway);
  }

  async getPods() {
    return this.send(
      `${this.baseUrl}/api/azure/aks/pods/names`,
      'GET'
    );
  }

  async getLogs(namespace, podName, tail) {
    return this.send(
      `${this.baseUrl}/api/azure/aks/${namespace}/${podName}/logs?tail=${tail}`,
      'GET'
    );
  }

  // async getLogsWithTimestamp(namespace, podName, tail, since) {
  //   const params = new URLSearchParams({
  //     tail: tail.toString()
  //   });

  //   if (since) {
  //     params.append('since', since);
  //   }

  //   return this.send(
  //     `${this.baseUrl}/api/azure/aks/${namespace}/${podName}/logs?${params.toString()}`,
  //     'GET'
  //   );
  // }

  async streamLogs(namespace, podName, onLog, onError) {
    // This would be for WebSocket streaming if your backend supports it
    // For now, we'll use polling in the frontend component
    console.log(
      'WebSocket streaming not implemented yet, using polling'
    );
  }
}
