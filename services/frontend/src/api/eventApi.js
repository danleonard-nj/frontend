import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class EventApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getEvents(startTimestamp) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/logs/events`);

    endpoint.searchParams.append('start_timestamp', startTimestamp);
    endpoint.searchParams.append('include_body', true);

    return await this.send(endpoint.toString(), 'GET');
  }
}
