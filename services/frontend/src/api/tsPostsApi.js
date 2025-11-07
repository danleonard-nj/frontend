import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class TsPostsApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getPosts() {
    const endpoint = new URL(`${this.baseUrl}/api/tools/ts/posts`);
    return await this.send(endpoint.toString(), 'GET');
  }

  async getPost(postId) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/ts/posts/${postId}`
    );
    return await this.send(endpoint.toString(), 'GET');
  }
}
