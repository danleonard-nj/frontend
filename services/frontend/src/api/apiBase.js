import { msalInstance } from '..';
import config from '../config.json';

export default class ApiBase {
  constructor(scope) {
    this.scope = scope;
    this.baseUrl = config.baseUrl;
  }

  get defaultOptions() {
    return {
      noContent: false,
      selector: null,
    };
  }

  get accounts() {
    return msalInstance.getAllAccounts();
  }

  async getToken() {
    const result = await msalInstance.acquireTokenSilent({
      scopes: [this.scope],
      account: this.accounts[0],
    });

    return result.accessToken;
  }

  async getAuthHeaders() {
    return {
      Authorization: `Bearer ${await this.getToken()}`,
      'Content-Type': 'application/json',
    };
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  async toResponse(response, options = null) {
    const { noContent = false, selector = null } =
      options ?? this.defaultOptions;

    const selectData = (data) => {
      if (selector) {
        return selector(data);
      }
      return data;
    };

    return {
      status: response.status,
      data: !noContent ? selectData(await response.json()) : null,
      isSuccess: !response.status > 300,
    };
  }

  async send(url, method, body = null, options = null) {
    var params = {
      method: method,
      headers: await this.getAuthHeaders(),
    };

    if (body) {
      params.body = JSON.stringify(body);
    }

    var response = await fetch(url, params);
    return await this.toResponse(response, options);
  }
}

export class UnauthorizedError extends Error {
  constructor(message, status) {
    this.message = message;
    this.status = status;
  }
}
