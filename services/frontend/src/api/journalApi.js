import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class JournalApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async listEntries(limit = 50) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries?limit=${limit}`,
      'GET',
    );
  }

  async createEntry(entry) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries`,
      'POST',
      entry,
    );
  }

  async getEntry(entryId) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}`,
      'GET',
    );
  }

  async processEntry(entryId, force = false) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}/process`,
      'POST',
      { force },
    );
  }

  async patchEntry(entryId, patch) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}`,
      'PATCH',
      patch,
    );
  }

  async deleteEntry(entryId) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}`,
      'DELETE',
    );
  }

  async polishEntry(entryId, modes) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}/polish`,
      'POST',
      { modes },
    );
  }

  async undoPolish(entryId) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}/polish/undo`,
      'POST',
    );
  }

  async getInsights(days = 14) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/insights?days=${days}`,
      'GET',
    );
  }
}
