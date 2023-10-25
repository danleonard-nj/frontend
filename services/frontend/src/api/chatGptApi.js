import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class ChatGptApi extends ApiBase {
  constructor() {
    super(serviceScopes.chatGpt);
  }

  getCompletionRequestBody = (prompt, tokens, model) => ({
    model: model,
    prompt: prompt,
    max_tokens: parseInt(tokens),
    temperature: 0.7,
  });

  getImageRequestBody = (prompt, repetitions, size) => ({
    prompt: prompt,
    n: repetitions ?? 2,
    size: size ?? '1024x1024',
  });

  getChatRequestBody = (messages, tokens, model, n = 1) => ({
    model: model,
    messages: messages,
    max_tokens: parseInt(tokens),
    n: parseInt(n),
    stream: false,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  async getChat(messages, tokens, model, n = 1) {
    return await this.send(
      `${this.baseUrl}/api/chatgpt/chat/completions`,
      'POST',
      this.getChatRequestBody(messages, tokens, model, n)
    );
  }

  async getPrediction(prompt, tokens, engine) {
    return await this.send(
      `${this.baseUrl}/api/chatgpt/completions`,
      'POST',
      this.getCompletionRequestBody(prompt, tokens, engine)
    );
  }

  async getImage(prompt, repetitions, size) {
    return await this.send(
      `${this.baseUrl}/api/chatgpt/images/generations`,
      'POST',
      this.getImageRequestBody(prompt, repetitions, size)
    );
  }

  async getEngines() {
    return await this.send(
      `${this.baseUrl}/api/chatgpt/engines`,
      'GET'
    );
  }

  async getHistoryEndpoints(startTimestamp, endpointFilter = null) {
    const endpoint = new URL(
      `${this.baseUrl}/api/tools/chatgpt/history`
    );

    endpoint.searchParams.append('start_timestamp', startTimestamp);

    if (endpointFilter) {
      endpoint.searchParams.append('endpoint', endpointFilter);
    }

    return await this.send(endpoint.toString(), 'GET');
  }
}
