import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class LocationApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async query(query) {
    return await this.send(
      `${this.baseUrl}/api/tools/location/history/query`,
      'POST',
      query
    );
  }
}
