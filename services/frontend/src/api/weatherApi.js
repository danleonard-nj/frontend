import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class WeatherApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getWeather(zipCode) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/weather`);

    endpoint.searchParams.append('zip_code', zipCode);

    return this.send(endpoint.toString(), 'GET');
  }
}
