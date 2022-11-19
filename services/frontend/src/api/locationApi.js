import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';
import config from '../config.json';

export default class LocationApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
    this.baseUrl = config.baseUrl;
  }

  async query(query) {
    return await this.send(
      `${this.baseUrl}/api/tools/location/history/query`,
      'POST',
      query
    );
  }
}
