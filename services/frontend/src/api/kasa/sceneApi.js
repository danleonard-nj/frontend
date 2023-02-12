import { serviceScopes } from '../../msalConfig';
import ApiBase from '../apiBase';

export default class SceneApi extends ApiBase {
  constructor() {
    super(serviceScopes.kasa);
  }

  async getScenes(categoryId) {
    return await this.send(
      categoryId
        ? `${this.baseUrl}/api/kasa/scene?category=${categoryId}`
        : `${this.baseUrl}/api/kasa/scene`,
      'GET'
    );
  }

  async getScene(sceneId) {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene/${sceneId}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    const json = await response.json();
    return { data: json, status: response.status };
  }

  async deleteScene(sceneId) {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene/${sceneId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    const json = await response.json();
    return { data: json, status: response.status };
  }

  async getSceneCategories() {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene/category`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    const json = await response.json();
    return { data: json, status: response.status };
  }

  async createSceneCategory(category) {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene/category`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(category),
    });

    const json = await response.json();
    return { data: json, status: response.status };
  }

  async deleteSceneCategory(sceneId) {
    const response = await fetch(
      `${this.baseUrl}/api/kasa/scene/category/${sceneId}`,
      {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      }
    );

    const json = await response.json();
    return { data: json, status: response.status };
  }

  async updateScene(scene) {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene`, {
      method: 'PUT',
      body: JSON.stringify(scene),
      headers: await this.getAuthHeaders(),
    });

    const json = await response.json();

    return { data: json, status: response.status };
  }

  async createScene(scene) {
    const response = await fetch(`${this.baseUrl}/api/kasa/scene`, {
      method: 'POST',
      body: JSON.stringify(scene),
      headers: await this.getAuthHeaders(),
    });

    const json = await response.json();

    return { data: json, status: response.status };
  }

  async runScene(sceneId, regionId) {
    const response = await fetch(
      regionId === null
        ? `${this.baseUrl}/api/kasa/scene/${sceneId}/run`
        : `${this.baseUrl}/api/kasa/scene/${sceneId}/run?region=${regionId}`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      }
    );

    const json = await response.json();

    return { data: json, status: response.status };
  }
}
