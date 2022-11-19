import config from '../config.json';
import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class KubeLogsApi extends ApiBase {
  constructor() {
    super(serviceScopes.azureGateway);
    this.baseUrl = config.gatewayBaseUrl;
  }

  async getPods() {
    return this.send(`${this.baseUrl}/api/azure/aks/pods/names`, 'GET');
  }

  async getLogs(namespace, podName, tail) {
    return this.send(
      `${this.baseUrl}/api/azure/aks/${namespace}/${podName}/logs?tail=${tail}`,
      'GET'
    );
  }
}
