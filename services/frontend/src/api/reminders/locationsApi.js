import ApiBase from '../apiBase';
import config from '../../config.json';
import { serviceScopes } from '../../msalConfig';

export default class LocationsApi extends ApiBase {
  constructor() {
    super(serviceScopes.reminders);
    this.baseUrl = config.baseUrl;
  }

  async getLocations() {
    return await this.send(`${this.baseUrl}/api/reminders/locations`, 'GET');
  }

  async createLocation(location) {
    return await this.send(
      `${this.baseUrl}/api/reminders/locations`,
      'POST',
      location
    );
  }

  async updateLocation(location) {
    return await this.send(
      `${this.baseUrl}/api/reminders/locations`,
      'PUT',
      location
    );
  }

  async getLocation(locationId) {
    return await this.send(
      `${this.baseUrl}/reminder/locations/${locationId}`,
      'GET'
    );
  }
}
