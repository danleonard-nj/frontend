import ApiBase from '../apiBase';
import config from '../../config.json';
import { serviceScopes } from '../../msalConfig';

export default class NotificationsApi extends ApiBase {
  constructor() {
    super(serviceScopes.reminders);
    this.baseUrl = config.baseUrl;
  }

  async getNotifications() {
    return await this.send(
      `${this.baseUrl}/api/reminders/notifications`,
      'GET'
    );
  }

  async createNotification(reminder) {
    return await this.send(
      `${this.baseUrl}/api/reminders/notifications`,
      'POST',
      reminder
    );
  }

  async updateNotification(reminder) {
    return await this.send(
      `${this.baseUrl}/api/reminders/notifications`,
      'PUT',
      reminder
    );
  }

  async getNotification(reminderId) {
    return await this.send(
      `${this.baseUrl}/notifications/${reminderId}`,
      'GET'
    );
  }
}
