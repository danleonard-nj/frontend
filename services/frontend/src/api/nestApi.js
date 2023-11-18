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

  async getSensorHistory(deviceId, hoursBack) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/nest/sensor/${deviceId}`
    );

    endpoint.searchParams.append('hours_back', hoursBack);

    return await this.send(endpoint.toString(), 'GET');
  }

  async getHistory(hoursBack, sample = '5min', deviceIds = []) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/nest/sensor`);

    endpoint.searchParams.append('hours_back', hoursBack);
    endpoint.searchParams.append('sample', sample);

    if (deviceIds.length > 0) {
      deviceIds.forEach((deviceId) => {
        endpoint.searchParams.append('device_id', deviceId);
      });
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

  async getIntegrationEvents(daysBack) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/nest/integration/events`
    );

    endpoint.searchParams.append('days_back', daysBack);

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
