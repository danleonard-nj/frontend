import { serviceScopes } from '../../msalConfig';
import ApiBase from '../apiBase';

export default class KasaApi extends ApiBase {
  constructor() {
    super(serviceScopes.kasa);
  }

  async getScenes() {
    return await this.send(`${this.baseUrl}/api/kasa/scene`, 'GET');
  }

  async deleteScene(sceneId) {
    return this.send(
      `${this.baseUrl}/api/kasa/scene/${sceneId}`,
      'DELETE'
    );
  }

  async updateScene(scene) {
    return await this.send(
      `${this.baseUrl}/api/kasa/scene`,
      'PUT',
      scene
    );
  }

  async createScene(scene) {
    return await this.send(
      `${this.baseUrl}/api/kasa/scene`,
      'POST',
      scene
    );
  }

  async getDevices() {
    const response = await this.send(
      `${this.baseUrl}/api/kasa/device`,
      'GET'
    );
    return response?.devices?.devices;
  }
}
