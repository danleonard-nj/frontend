import ApiBase from './apiBase';
import { serviceScopes } from '../msalConfig';

export default class ShipEngineApi extends ApiBase {
  constructor() {
    super(serviceScopes.shipEngine);
  }

  async getShipments(pageNumber, pageSize, cancelled = false) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/shipment?page_number=${
        pageNumber ?? 1
      }&page_size=${pageSize}&cancelled=${cancelled.toString()}`,
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

  async estimateRates(shipment) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/rates/estimate`,
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

  async voidLabel(labelId) {
    const response = await this.send(
      `${this.baseUrl}/api/shipengine/labels/${labelId}/void`,
      'PUT'
    );
    return response;
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
