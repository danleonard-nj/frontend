import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class PodcastApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getPodcasts() {
    return this.send(
      `${this.baseUrl}/api/tools/podcasts/shows`,
      'GET'
    );
  }
}
