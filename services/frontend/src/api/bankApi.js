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

  async getBalanceHistory(startDate, endDate, keys = []) {
    const url = new URL(
      `${this.baseUrl}/api/tools/bank/balances/history`
    );

    url.searchParams.append('start_timestamp', startDate);
    url.searchParams.append('end_timestamp', endDate);
    url.searchParams.append('group_institutions', 'true');
    keys.forEach((key) => url.searchParams.append('bank_key', key));

    return await this.send(url.toString(), 'GET');
  }

  async getTransactions(startDate, endDate, keys = []) {
    const url = new URL(
      `${this.baseUrl}/api/tools/bank/transactions`
    );

    url.searchParams.append('start_timestamp', startDate);
    url.searchParams.append('end_timestamp', endDate);
    keys.forEach((key) => url.searchParams.append('bank_key', key));

    return await this.send(url.toString(), 'GET');
  }
}
