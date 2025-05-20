import ApiBase from './apiBase';
import { serviceScopes } from '../msalConfig';

// Utility functions for mapping frontend <-> backend fields
function toBackendAddress(address) {
  return {
    name:
      address.label || `${address.first_name} ${address.last_name}`,
    street: address.address_one,
    city: address.city_locality,
    state: address.state_province,
    postal_code: address.zip_code,
    country: address.country || 'US',
    is_default: address.is_default || false,
  };
}

function fromBackendAddress(address) {
  return {
    id: address.id,
    label: address.name,
    first_name:
      address.first_name ||
      (address.name ? address.name.split(' ')[0] : ''),
    last_name:
      address.last_name ||
      (address.name
        ? address.name.split(' ').slice(1).join(' ')
        : ''),
    address_one: address.street,
    city_locality: address.city,
    state_province: address.state,
    zip_code: address.postal_code,
    country: address.country,
    phone: address.phone || '',
    is_default: address.is_default,
  };
}

export default class AddressBookApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools); // or another scope if needed
  }

  async fetchAddresses() {
    const res = await this.send(
      `${this.baseUrl}/api/shipengine/addresses?page_size=100&page_number=1`,
      'GET'
    );
    return (res.data.addresses || []).map(fromBackendAddress);
  }

  async addAddress(address) {
    const res = await this.send(
      `${this.baseUrl}/api/shipengine/addresses`,
      'POST',
      toBackendAddress(address)
    );
    return fromBackendAddress(res.data.address || res.data);
  }

  async editAddress(id, address) {
    const res = await this.send(
      `${this.baseUrl}/api/shipengine/addresses/${id}`,
      'PUT',
      toBackendAddress(address)
    );
    return fromBackendAddress(res.data.address || res.data);
  }

  async deleteAddress(id) {
    await this.send(
      `${this.baseUrl}/api/shipengine/addresses/${id}`,
      'DELETE'
    );
  }

  async setDefaultAddress(id) {
    await this.send(
      `${this.baseUrl}/api/shipengine/addresses/${id}/default`,
      'PUT'
    );
    // Refetch the address to get updated default status
    const addrRes = await this.send(
      `${this.baseUrl}/api/shipengine/addresses/${id}`,
      'GET'
    );
    return fromBackendAddress(addrRes.data.address || addrRes.data);
  }

  async getDefaultAddress() {
    const res = await this.send(
      `${this.baseUrl}/api/shipengine/addresses/default`,
      'GET'
    );
    return fromBackendAddress(res.data.address);
  }

  async validateAddress(address) {
    const res = await this.send(
      `${this.baseUrl}/api/shipengine/addresses/validate`,
      'POST',
      toBackendAddress(address)
    );
    return res.data;
  }
}
