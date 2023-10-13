import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class JournalApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getEntries(startDate, endDate = null) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/journal`);

    endpoint.searchParams.append('start_date', startDate);

    if (endDate) {
      endpoint.searchParams.append('end_date', endDate);
    }

    return await this.send(endpoint.toString(), 'GET');
  }

  async getEntry(entryId) {
    return await this.send(
      `${this.baseUrl}/api/tools/journal/${entryId}`,
      'GET'
    );
  }

  async getEntry(entryId) {
    return await this.send(
      `${this.baseUrl}/api/tools/journal/${entryId}`,
      'GET'
    );
  }

  async createEntry(entry) {
    return await this.send(
      `${this.baseUrl}/api/tools/journal`,
      'POST',
      entry
    );
  }

  async getUnits() {
    return await this.send(
      `${this.baseUrl}/api/tools/journal/unit`,
      'GET'
    );
  }

  async createUnit(unit) {
    return await this.send(
      `${this.baseUrl}/api/tools/journal/unit`,
      'POST'
    );
  }

  async deleteUnit(unitId) {
    return await this.send(
      `${this.baseUrl}/api/tools/journal/unit/${unitId}`,
      'DELETE'
    );
  }

  async getCategories() {
    return await this.send(
      `${this.baseUrl}/api/tools/journal/category`,
      'GET'
    );
  }

  async createCategory(category) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/category`,
      'POST',
      category
    );
  }

  async deleteCategory(categoryId) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/category/${categoryId}`,
      'DELETE'
    );
  }
}
