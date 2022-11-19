import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';
import config from '../config.json';

export default class AzureGatewayApi extends ApiBase {
  constructor() {
    super(serviceScopes.azureGateway);
    this.baseUrl = config.gatewayBaseUrl;
  }

  async getActiveDirectoryApplications() {
    const response = await this.send(
      `${this.baseUrl}/api/azure/ad/applications`,
      'GET'
    );
    return response?.data;
  }
}
