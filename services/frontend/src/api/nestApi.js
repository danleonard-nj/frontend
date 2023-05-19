import ApiBase from './apiBase';
import { serviceScopes } from '../msalConfig';

export default class NestApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getThermostatInfo() {
    return await this.send(
      `${this.baseUrl}/api/tools/nest/thermostat`,
      'GET'
    );
  }

  async getSensorInfo() {
    return await this.send(
      `${this.baseUrl}/api/tools/nest/sensor/info`,
      'GET'
    );
  }
}
