//  services/frontend/src/api/calendarApi.js
import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class CalendarApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  async generateCalendarEvent(data) {
    // Handle both old format (just string) and new format (object with prompt and images)
    if (typeof data === 'string') {
      // Legacy text-only format
      return await this.send(
        `${this.baseUrl}/api/tools/calendar/prompt`,
        'POST',
        { prompt: data }
      );
    }

    const { prompt, images = [] } = data;

    // Prepare the request payload in the exact format: { "image_base64": "...", "prompt": "..." }
    const payload = {};

    // Add prompt if provided
    if (prompt && prompt.trim()) {
      payload.prompt = prompt;
    }

    // Add image_base64 if images are provided (use first image if multiple)
    if (images.length > 0) {
      let base64 = images[0].base64;
      // Remove 'data:image/png;base64,' prefix if present
      if (base64.startsWith('data:image/png;base64,')) {
        base64 = base64.replace('data:image/png;base64,', '');
      }
      payload.image_base64 = base64;
    }

    // Use the single endpoint for all requests
    return await this.send(
      `${this.baseUrl}/api/tools/calendar/prompt`,
      'POST',
      payload
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
