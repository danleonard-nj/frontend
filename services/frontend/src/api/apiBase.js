import { msalInstance } from '..';
import { getConfig } from './data/configProvider';

export default class ApiBase {
  constructor(scope) {
    const config = getConfig();
    this.scope = scope;
    this.baseUrl = config.apiBaseUrl;
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
    // Fetch a token for the provided scope w/ the
    // active user identity
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
    // No content indicates we don't need to deserialize the response
    // Selector takes a reducer function w/ a single param containing
    // the deserialize dresponse
    const { noContent = false, selector = null } =
      options ?? this.defaultOptions;

    const selectData = (data) => {
      if (selector) {
        return selector(data);
      }
      return data;
    };

    const isSuccess = response.status < 200 && response.status >= 300;

    console.log('Response: ', response);
    console.log('Status: ', response.status);

    return {
      status: response.status,
      data: !noContent ? selectData(await response.json()) : null,
      isSuccess: isSuccess,
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
