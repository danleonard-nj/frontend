import config from '../../config.json';
import ApiBase from '../apiBase';

export default class FeatureApi extends ApiBase {
  constructor() {
    super(null);

    this.baseUrl = config.features.baseUrl;
    this.apiKey = config.features.apiKey;
    this.apiHeaderKey = config.features.apiHeaderKey;
  }

  async getAuthHeaders() {
    return {
      [this.apiHeaderKey]: this.apiKey,
      'content-type': 'application/json',
    };
  }

  async getFeatures() {
    return await this.send(`${this.baseUrl}/api/feature`, 'GET');
  }

  async getFeatureById(featureId) {
    return await this.send(
      `${this.baseUrl}/api/feature/id/${featureId}`,
      'GET'
    );
  }

  async getFeatureByKey(featureKey) {
    return await this.send(
      `${this.baseUrl}/api/feature/key/${featureKey}`,
      'GET'
    );
  }

  async deleteFeature(featureId) {
    return await this.send(
      `${this.baseUrl}/api/feature/id/${featureId}`,
      'DELETE'
    );
  }

  async setFeature(featureKey, value) {
    return await this.send(
      `${this.baseUrl}/api/feature/evaluate/${featureKey}`,
      'PUT',
      { value: value }
    );
  }

  async createFeature(feature) {
    return await this.send(`${this.baseUrl}/api/feature`, 'POST', feature);
  }
}
