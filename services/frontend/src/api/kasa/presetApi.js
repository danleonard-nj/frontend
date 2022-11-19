import { Token } from '@mui/icons-material';
import { serviceScopes } from '../../msalConfig';
import ApiBase from '../apiBase';

export default class PresetApi extends ApiBase {
  constructor() {
    super(serviceScopes.kasa);
  }

  async updatePreset(preset) {
    const response = await fetch(`${this.baseUrl}/api/kasa/preset`, {
      method: 'PUT',
      body: JSON.stringify(preset),
      headers: await this.getAuthHeaders(),
    });

    const json = await response.json();

    return { data: json, status: response.status };
  }

  async createPreset(preset) {
    const response = await fetch(`${this.baseUrl}/api/kasa/preset`, {
      method: 'POST',
      body: JSON.stringify(preset),
      headers: await this.getAuthHeaders(),
    });

    const json = await response.json();

    return { data: json, status: response.status };
  }

  async getPresets() {
    const response = await fetch(`${this.baseUrl}/api/kasa/preset`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    const json = await response.json();
    return { data: json, status: response.status };
  }

  async getPreset(presetId) {
    const response = await fetch(
      `${this.baseUrl}/api/kasa/preset/${presetId}`,
      {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      }
    );

    const json = await response.json();
    return { data: json, status: response.status };
  }

  async deletePreset(presetId) {
    const response = await fetch(
      `${this.baseUrl}/api/kasa/preset/${presetId}`,
      {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      }
    );

    const json = await response.json();
    return { data: json, status: response.status };
  }
}
