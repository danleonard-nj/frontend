import config from '../config.json';
import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class FitnessApi extends ApiBase {
  constructor() {
    super(serviceScopes.fitness);
    this.baseUrl = config.baseUrl;
  }

  async getFitnessRange(startDate, endDate) {
    return await this.send(
      `${this.baseUrl}/api/fitness/range?start_date=${startDate}&end_date=${endDate}`,
      'GET'
    );
  }

  async getCalorieDeltas(startDate, endDate) {
    return await this.send(
      `${this.baseUrl}/api/fitness/calories/delta?start_date=${startDate}&end_date=${endDate}`,
      'GET'
    );
  }

  async getConfig() {
    return await this.send(`${this.baseUrl}/api/fitness/config`, 'GET');
  }

  async createConfig(config) {
    return await this.send(
      `${this.baseUrl}/api/fitness/config`,
      'POST',
      config
    );
  }
}
