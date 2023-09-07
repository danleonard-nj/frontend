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

  async disarm() {
    return await this.send(
      `${this.baseUrl}/api/tools/dms/disarm`,
      'POST'
    );
  }
}
