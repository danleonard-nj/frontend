import ApiBase from './apiBase';
import { serviceScopes } from '../msalConfig';

export default class ReverbApi extends ApiBase {
  constructor() {
    super(serviceScopes.reverb);
  }

  async getOrders(pageNumber) {
    return await this.send(
      `${this.baseUrl}/api/reverb/orders?page_number=${pageNumber}`,
      'GET'
    );
  }

  async createOrderShipment(orderNumber, orderDetail) {
    return this.send(
      `${this.baseUrl}/api/reverb/shipengine/shipments/${orderNumber}`,
      'POST',
      orderDetail
    );
  }
}
