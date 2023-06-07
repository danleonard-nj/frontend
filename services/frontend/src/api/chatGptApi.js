import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class ChatGptApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  getCompletionRequestBody = (prompt, tokens) => ({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: tokens,
    temperature: 0.7,
  });

  getImageRequestBody = (prompt, repetitions, size) => ({
    prompt: prompt,
    n: repetitions ?? 2,
    size: size ?? '1024x1024',
  });

  async getPrediction(prompt, tokens) {
    return await this.send(
      `${this.baseUrl}/api/tools/chatgpt/completions`,
      'POST',
      this.getCompletionRequestBody(prompt, tokens)
    );
  }

  async getImage(prompt, repetitions, size) {
    return await this.send(
      `${this.baseUrl}/api/tools/chatgpt/images/generations`,
      'POST',
      this.getImageRequestBody(prompt, repetitions, size)
    );
  }

  async getEngines() {
    return await this.send(
      `${this.baseUrl}/api/tools/chatgpt/engines`,
      'GET'
    );
  }

  async getUsage(startDate, endDate) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/chatgpt/usage`
    );

    endpoint.searchParams.append('start_date', startDate);
    endpoint.searchParams.append('end_date', endDate);

    console.log(endpoint.toString());

    return await this.send(endpoint.toString(), 'GET');
  }
}
