import ApiBase from './apiBase';
import config from '../config.json';
import { serviceScopes } from '../msalConfig';

export default class ShipEngineApi extends ApiBase {
  constructor() {
    super(serviceScopes.shipEngine);
    this.baseUrl = config.gatewayBaseUrl;
  }

  async getShipments(pageNumber, pageSize) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/shipment?page_number=${
        pageNumber ?? 1
      }&page_size=${pageSize}`,
      'GET'
    );
    return response;
  }

  async getCarriers() {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/carriers`,
      'GET'
    );
    return response;
  }

  async getServiceCodes() {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/carriers/services`,
      'GET'
    );
    return response;
  }

  async getBalances() {
    const response = await this.send(
      `${this.baseUrl}/api/carriers/balances`,
      'GET'
    );
    return response?.balances;
  }

  async getRate(shipment) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/rates`,
      'POST',
      shipment
    );
    return response;
  }

  async cancelShipment(shipmentId) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/shipment/${shipmentId}/cancel`,
      'PUT'
    );
    return response;
  }

  async getLabel(shipmentId) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/shipments/${shipmentId}/label`,
      'GET'
    );
    return response;
  }

  async createLabel(shipmentId) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/shipments/${shipmentId}/label`,
      'POST'
    );
    return response?.label;
  }

  async postCreateShipment(shipment) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/shipment`,
      'POST',
      shipment
    );
    return response;
  }
}
