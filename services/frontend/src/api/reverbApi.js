import ApiBase from './apiBase';
import config from '../config.json';
import { serviceScopes } from '../msalConfig';

export default class ReverbApi extends ApiBase {
  constructor() {
    super(serviceScopes.reverb);
    this.baseUrl = config.gatewayBaseUrl;
  }

  async getOrders(pageNumber) {
    return await this.send(
      `${this.baseUrl}/api/reverb/orders?page_number=${pageNumber}`,
      'GET'
    );
  }

  async createOrderShipment(orderNumber, orderDetail) {
    this.send(
      `${this.baseUrl}/api/reverb/shipengine/shipments/${orderNumber}`,
      'POST',
      orderDetail
    );
  }
}
