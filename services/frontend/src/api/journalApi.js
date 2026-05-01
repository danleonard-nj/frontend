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

  async reprocessEntry(entryId, force = true) {
    const params = force ? '?force=true' : '?force=false';
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}/reprocess${params}`,
      'POST',
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

  async listTags() {
    return this.send(`${this.baseUrl}/api/tools/journal/tags`, 'GET');
  }

  // ── Attachments ──────────────────────────────────────────────────────

  async listAttachments(entryId) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}/attachments`,
      'GET',
    );
  }

  async uploadAttachment(entryId, file) {
    const url = `${this.baseUrl}/api/tools/journal/entries/${entryId}/attachments`;
    const token = await this.getToken();
    const form = new FormData();
    form.append('file', file, file.name);
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    return {
      status: response.status,
      data,
      isSuccess: response.status >= 200 && response.status < 300,
    };
  }

  async deleteAttachment(entryId, attachmentId) {
    return this.send(
      `${this.baseUrl}/api/tools/journal/entries/${entryId}/attachments/${attachmentId}`,
      'DELETE',
    );
  }

  async downloadAttachment(entryId, attachmentId) {
    const url = `${this.baseUrl}/api/tools/journal/entries/${entryId}/attachments/${attachmentId}`;
    const token = await this.getToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      return { status: response.status, blob: null, filename: null };
    }
    const blob = await response.blob();
    // Extract filename from Content-Disposition if present
    const disposition =
      response.headers.get('Content-Disposition') || '';
    const match = /filename="?([^"]+)"?/i.exec(disposition);
    return {
      status: response.status,
      blob,
      filename: match ? match[1] : null,
    };
  }
}
