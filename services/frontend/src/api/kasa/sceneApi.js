import { serviceScopes } from '../../msalConfig';
import ApiBase from '../apiBase';

export default class SceneApi extends ApiBase {
  constructor() {
    super(serviceScopes.kasa);
  }

  async getScenes(categoryId) {
    return await this.send(
      categoryId === null || categoryId === undefined
        ? `${this.baseUrl}/api/kasa/scene`
        : `${this.baseUrl}/api/kasa/scene?category=${categoryId}`,
      'GET'
    );
  }

  async getScene(sceneId) {
    return await this.send(
      `${this.baseUrl}/api/kasa/scene/${sceneId}`,
      'GET'
    );
  }

  async deleteScene(sceneId) {
    return await this.send(
      `${this.baseUrl}/api/kasa/scene/${sceneId}`,
      'DELETE'
    );
  }

  async getSceneCategories() {
    return await this.send(
      `${this.baseUrl}/api/kasa/scene/category`,
      'GET'
    );
  }

  async createSceneCategory(category) {
    return await this.send(
      `${this.baseUrl}/api/kasa/scene/category`,
      'POST',
      category
    );
  }

  async deleteSceneCategory(sceneId) {
    return await this.send(
      `${this.baseUrl}/api/kasa/scene/category/${sceneId}`,
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

  async runScene(sceneId, regionId) {
    return await this.send(
      regionId === null || regionId === undefined
        ? `${this.baseUrl}/api/kasa/scene/${sceneId}/run`
        : `${this.baseUrl}/api/kasa/scene/${sceneId}/run?region=${regionId}`,
      'POST'
    );
  }
}
