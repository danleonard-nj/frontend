import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class NestApi extends ApiBase {
  constructor() {
    super(serviceScopes.nest);
  }

  async getSensorInfo() {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/nest/sensor/info`
    );

    return await this.send(endpoint.toString(), 'GET');
  }

  async getSensorHistory(startTimestamp, endTimestamp) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/nest/sensor`);

    endpoint.searchParams.append('start_timestamp', startTimestamp);

    if (endTimestamp) {
      endpoint.searchParams.append('end_timestamp', endTimestamp);
    }

    return await this.send(endpoint.toString(), 'GET');
  }

  async getSensorInfo() {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/nest/sensor/info`
    );

    return await this.send(endpoint.toString(), 'GET');
  }

  async getThermostat() {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/nest/thermostat`
    );

    return await this.send(endpoint.toString(), 'GET');
  }

  async getThermostatCommands() {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/nest/command`
    );

    return await this.send(endpoint.toString(), 'GET');
  }

  async postThermostatCommand(command) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/nest/command`
    );

    return await this.send(endpoint.toString(), 'POST', command);
  }
}
