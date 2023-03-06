import { serviceScopes } from '../../msalConfig';
import ApiBase from '../apiBase';

export default class PresetApi extends ApiBase {
  constructor() {
    super(serviceScopes.kasa);
  }

  async updatePreset(preset) {
    return await this.send(
      `${this.baseUrl}/api/kasa/preset`,
      'PUT',
      preset
    );
  }

  async createPreset(preset) {
    return await this.send(
      `${this.baseUrl}/api/kasa/preset`,
      'POST',
      preset
    );
  }

  async getPresets() {
    return await this.send(`${this.baseUrl}/api/kasa/preset`, 'GET');
  }

  async getPreset(presetId) {
    return await this.send(
      `${this.baseUrl}/api/kasa/preset/${presetId}`,
      'GET'
    );
  }

  async deletePreset(presetId) {
    return await this.send(
      `${this.baseUrl}/api/kasa/preset/${presetId}`,
      'DELETE'
    );
  }
}
