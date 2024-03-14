import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class RedisManagementApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getKeys() {
    const endpoint = new URL(`${this.baseUrl}/api/tools/redis/keys`);

    return this.send(endpoint.toString(), 'GET');
  }

  async setValue(key, value, parseJson = false) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/redis/set`);

    const req = {
      key_name: key,
      value: value,
      parse_json: parseJson,
    };

    return this.send(endpoint.toString(), 'POST', req);
  }

  async getValue(key, parseJson = false) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/redis/get`);

    const req = {
      key_name: key,
      parse_json: parseJson,
    };

    return this.send(endpoint.toString(), 'POST', req);
  }

  async deleteKey(key) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/redis/delete`
    );

    const req = {
      key_name: key,
    };

    return this.send(endpoint.toString(), 'POST', req);
  }
}
