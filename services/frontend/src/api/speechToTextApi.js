import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

export default class SpeechToTextApi extends ApiBase {
  constructor() {
    super(serviceScopes.kubeTools);
  }

  /**
   * Transcribe audio to text using speech recognition
   *
   * @param {Blob} audioBlob - Audio data to transcribe (webm, mp3, etc.)
   * @returns {Promise<{text: string}>} Transcribed text
   *
   * Note: Uses FormData instead of JSON because we're uploading a file.
   * The backend endpoint should expect multipart/form-data with an 'audio' field.
   */
  async transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');

    // Get auth token for the request
    const token = await this.getToken();

    const response = await fetch(`${this.baseUrl}/api/transcribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - browser sets it with boundary for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get transcription history (if backend stores history)
   * @returns {Promise<Array>} List of past transcriptions
   */
  async getTranscriptionHistory() {
    return this.send(`${this.baseUrl}/api/transcribe/history`, 'GET');
  }
}
