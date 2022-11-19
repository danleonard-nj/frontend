import config from '../../config.json';

export default class FeatureApi {
  constructor() {
    this.baseUrl = config.featuresBaseUrl;
    this.apiKey = config.featureApiKey;
  }

  getHeaders() {
    return {
      'api-key': config.featureApiKey,
      'content-type': 'application/json',
    };
  }

  async getFeatures() {
    const response = await fetch(`${this.baseUrl}/api/feature`, {
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async getFeatureById() {
    const response = await fetch(`${this.baseUrl}/api/feature`, {
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async getFeatureByKey(featureKey) {
    const response = await fetch(`${this.baseUrl}/api/feature/${featureKey}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async deleteFeature(featureId) {
    const response = await fetch(
      `${this.baseUrl}/api/feature/id/${featureId}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
      }
    );

    return await response.json();
  }

  async setFeature(featureKey, value) {
    const body = {
      value: value,
    };

    const response = await fetch(
      `${this.baseUrl}/api/feature/set/${featureKey}`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      }
    );
    return await response.json();
  }

  async createFeature(feature) {
    const response = await fetch(`${this.baseUrl}/api/feature`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(feature),
    });
    return await response.json();
  }
}
