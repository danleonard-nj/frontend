import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class DmsApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async poll() {
    return await this.send(
      `${this.baseUrl}/api/tools/dms/poll`,
      'POST'
    );
  }

  async getHistory(daysBack) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/dms/history`);

    endpoint.searchParams.append('days_back', daysBack);

    return await this.send(endpoint, 'GET');
  }

  async disarm() {
    return await this.send(
      `${this.baseUrl}/api/tools/dms/disarm`,
      'POST',
      {
        username: this.getUsername(),
      }
    );
  }
}
