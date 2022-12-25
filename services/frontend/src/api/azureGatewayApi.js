import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class AzureGatewayApi extends ApiBase {
  constructor() {
    super(serviceScopes.azureGateway);
  }

  async getActiveDirectoryApplications() {
    const response = await this.send(
      `${this.baseUrl}/api/azure/ad/applications`,
      'GET'
    );
    return response?.data;
  }
}
