import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class TsPostsApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getPosts(
    limit = 10,
    startTimestamp = null,
    endTimestamp = null
  ) {
    const endpoint = new URL(`${this.baseUrl}/api/tools/ts/posts`);
    endpoint.searchParams.append('limit', limit);

    if (startTimestamp) {
      endpoint.searchParams.append('start_timestamp', startTimestamp);
    }

    if (endTimestamp) {
      endpoint.searchParams.append('end_timestamp', endTimestamp);
    }

    return await this.send(endpoint.toString(), 'GET');
  }

  async getPost(postId) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/ts/posts/${postId}`
    );
    return await this.send(endpoint.toString(), 'GET');
  }
}
