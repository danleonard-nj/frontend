import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class GmailRuleApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async getRules() {
    return await this.send(
      `${this.baseUrl}/api/tools/google/gmail/rule`,
      'GET'
    );
  }

  async getRule(ruleId) {
    return await this.send(
      `${this.baseUrl}/api/tools/google/gmail/rule/${ruleId}`,
      'GET'
    );
  }

  async deleteRule(ruleId) {
    return await this.send(
      `${this.baseUrl}/api/tools/gmail/rule/${ruleId}`,
      'DELETE'
    );
  }

  async createRule(createRuleRequest) {
    return await this.send(
      `${this.baseUrl}/api/tools/gmail/rule`,
      'POST',
      createRuleRequest
    );
  }

  async createRule(updateRuleRequest) {
    return await this.send(
      `${this.baseUrl}/api/tools/gmail/rule`,
      'PUT',
      updateRuleRequest
    );
  }
}
