import { serviceScopes } from '../../msalConfig';
import ApiBase from '../apiBase';

export default class KasaApi extends ApiBase {
  constructor() {
    super(serviceScopes.kasa);
  }

  async getScenes() {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const json = await response.json();
    return { data: json?.scenes, status: response.status };
  }

  async deleteScene(sceneId) {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene/${sceneId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    const json = await response.json();
    return { data: json, status: response.status };
  }

  async updateScene(scene) {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene`, {
      method: 'PUT',
      body: JSON.stringify(scene),
      headers: this.getHeaders(),
    });

    const json = await response.json();

    return { data: json, status: response.status };
  }

  async createScene(scene) {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene`, {
      method: 'POST',
      body: JSON.stringify(scene),
      headers: this.getHeaders(),
    });

    const json = await response.json();

    return { data: json, status: response.status };
  }

  async getDevices() {
    const response = await this.send(`${this.baseUrl}/api/kasa/device`, 'GET');
    return response?.devices?.devices;
  }
}
