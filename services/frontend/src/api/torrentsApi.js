import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class TorrentApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getTorrents(searchTerm, page) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/torrents/search`
    );

    endpoint.searchParams.append('q', searchTerm);
    endpoint.searchParams.append('page', page);

    return this.send(endpoint.toString(), 'GET');
  }

  async getMagentLink(stub) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/torrents/magnet`
    );

    return this.send(endpoint.toString(), 'POST', { stub: stub });
  }
}
