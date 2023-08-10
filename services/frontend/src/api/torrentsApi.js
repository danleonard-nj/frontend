import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class TorrentApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getTorrents(searchTerm, page, torrentSource = '1337x') {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/torrents/search`
    );

    endpoint.searchParams.append('q', searchTerm);
    endpoint.searchParams.append('page', page);
    endpoint.searchParams.append('target', torrentSource);

    return this.send(endpoint.toString(), 'GET');
  }

  async getMagentLink(payload) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/torrents/magnet`
    );

    return this.send(endpoint.toString(), 'POST', payload);
  }
}
