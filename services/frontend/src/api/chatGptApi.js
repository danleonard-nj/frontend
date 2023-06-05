import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';
import { getConfig } from './data/configProvider';

export default class ChatGptApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);

    const config = getConfig();
    this.baseUrl = config.chatGptConfig.baseUrl;
  }

  getRequestBody = (prompt, tokens) => ({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: tokens,
    temperature: 0.7,
  });

  async getPrediction(prompt, tokens) {
    return this.send(
      `${this.baseUrl}/completions`,
      'POST',
      this.getRequestBody(prompt, tokens)
    );
  }

  async getEngines() {
    return this.send(`${this.baseUrl}/engines`, 'GET');
  }
}
