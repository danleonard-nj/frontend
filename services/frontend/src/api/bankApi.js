import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class BankApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getBalances() {
    return await this.send(
      `${this.baseUrl}/api/tools/bank/balances`,
      'GET'
    );
  }

  async getBalance(key) {
    return await this.send(
      `${this.baseUrl}/api/tools/bank/balances/${key}`,
      'GET'
    );
  }
}
