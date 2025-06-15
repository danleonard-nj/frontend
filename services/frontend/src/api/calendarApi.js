// services/frontend/src/api/calendarApi.js
import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class CalendarApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async generateCalendarEvent(prompt) {
    return await this.send(
      `${this.baseUrl}/api/tools/calendar/prompt`,
      'POST',
      { prompt }
    );
  }

  async saveCalendarEvent(eventData) {
    return await this.send(
      `${this.baseUrl}/api/tools/calendar/save`,
      'POST',
      eventData
    );
  }
}
