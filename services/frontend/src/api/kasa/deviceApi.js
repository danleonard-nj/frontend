import { serviceScopes } from '../../msalConfig';
import ApiBase from '../apiBase';

export default class DeviceApi extends ApiBase {
  constructor() {
    super(serviceScopes.kasa);
  }

  async getDevices() {
    return this.send(`${this.baseUrl}/api/kasa/device`, 'GET');
  }

  async updateDevice(device) {
    return this.send(`${this.baseUrl}/api/kasa/device`, 'PUT', device);
  }

  async getDevice(deviceId) {
    return this.send(`${this.baseUrl}/api/kasa/device/${deviceId}`, 'GET');
  }

  async getDeviceClientResponse(deviceId) {
    return this.send(
      `${this.baseUrl}/api/kasa/device/${deviceId}/response`,
      'GET'
    );
  }

  async syncDevices() {
    return this.send(`${this.baseUrl}/api/kasa/device/sync`, 'POST');
  }

  async getRegions() {
    return this.send(`${this.baseUrl}/api/kasa/region`, 'GET');
  }
}
