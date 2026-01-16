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

    console.log('Sending audio to backend:', {
      blobSize: audioBlob.size,
      blobType: audioBlob.type,
    });

    // Get auth token for the request
    const token = await this.getToken();

    const response = await fetch(
      `${this.baseUrl}/api/tools/transcribe`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser sets it with boundary for multipart/form-data
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Backend response:', result);
    return result;
  }

  /**
   * Transcribe uploaded audio file
   *
   * @param {File} audioFile - Audio file to transcribe
   * @returns {Promise<{text: string}>} Transcribed text
   */
  async transcribeFile(audioFile) {
    const formData = new FormData();
    formData.append('audio', audioFile, audioFile.name);

    console.log('Uploading audio file:', {
      fileName: audioFile.name,
      fileSize: audioFile.size,
      fileType: audioFile.type,
    });

    // Get auth token for the request
    const token = await this.getToken();

    const response = await fetch(
      `${this.baseUrl}/api/tools/transcribe`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser sets it with boundary for multipart/form-data
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Backend response:', result);
    return result;
  }

  /**
   * Get transcription history (if backend stores history)
   * @returns {Promise<Array>} List of past transcriptions
   */
  async getTranscriptionHistory() {
    console.log('SpeechToTextApi: getTranscriptionHistory called');
    console.log('BaseUrl:', this.baseUrl);
    const result = await this.send(
      `${this.baseUrl}/api/tools/transcribe/history`,
      'GET'
    );
    console.log('SpeechToTextApi: history result:', result);
    return result;
  }
}
