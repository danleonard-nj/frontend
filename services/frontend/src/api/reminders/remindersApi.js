import ApiBase from '../apiBase';
import config from '../../config.json';
import { serviceScopes } from '../../msalConfig';

export const reminderType = {
  destination: 'DESTINATION',
  generic: 'GENERAL',
};
export default class RemindersApi extends ApiBase {
  constructor() {
    super(serviceScopes.reminders);
    this.baseUrl = config.baseUrl;
  }

  async getReminders() {
    return await this.send(`${this.baseUrl}/api/reminders`, 'GET');
  }

  async deleteGenericReminder(reminderId) {
    return await this.send(
      `${this.baseUrl}/api/reminders/generic/${reminderId}`,
      'DELETE'
    );
  }

  async deleteDestinationReminder(reminderId) {
    return await this.send(
      `${this.baseUrl}/api/reminders/destination/${reminderId}`,
      'DELETE'
    );
  }

  async createGenericReminder(reminder) {
    return await this.send(
      `${this.baseUrl}/api/reminders/generic`,
      'POST',
      reminder
    );
  }

  async createDestinationReminder(reminder) {
    return await this.send(
      `${this.baseUrl}/api/reminders/destination`,
      'POST',
      reminder
    );
  }

  async updateGenericReminder(reminder) {
    return await this.send(
      `${this.baseUrl}/api/reminders/generic`,
      'PUT',
      reminder
    );
  }

  async updateDestinationReminder(reminder) {
    return await this.send(
      `${this.baseUrl}/api/reminders/destination`,
      'PUT',
      reminder
    );
  }

  async getGenricReminder(reminderId) {
    return await this.send(
      `${this.baseUrl}/api/reminders/generic/${reminderId}`,
      'GET'
    );
  }

  async getDestinationReminder(reminderId) {
    return await this.send(
      `${this.baseUrl}/api/reminders/destination/${reminderId}`,
      'GET'
    );
  }
  async getTimezones() {
    return await this.send(
      `${this.baseUrl}/api/reminders/utilities/timezones`,
      'GET'
    );
  }

  async getCronDescriptor(cron) {
    const response = await this.send(
      `${this.baseUrl}/api/reminders/utilities/cron`,
      'POST',
      {
        cron: cron,
      }
    );

    return response?.descriptor;
  }
}
