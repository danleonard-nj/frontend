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
   * @param {boolean} diarize - Whether to enable speaker diarization
   * @returns {Promise<{text: string, segments?: Array}>} Transcribed text with optional segments
   *
   * Note: Uses FormData instead of JSON because we're uploading a file.
   * The backend endpoint should expect multipart/form-data with an 'audio' field.
   */
  async transcribeAudio(audioBlob, diarize = false) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    if (diarize) {
      formData.append('diarize', 'true');
    }

    // Get auth token for the request
    const token = await this.getToken();

    try {
      const response = await fetch(
        `${this.baseUrl}/api/tools/transcribe`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - browser sets it with boundary for multipart/form-data
          },
          body: formData,
        },
      );

      if (!response.ok) {
        // Try to extract error message from response body
        let errorMessage = `Transcription failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the default message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      return result;
    } catch (error) {
      // Re-throw with more context if it's a network error
      if (error.message === 'Failed to fetch') {
        throw new Error(
          'Network error: Unable to reach the transcription service. Please check your connection and try again.',
        );
      }
      throw error;
    }
  }

  /**
   * Transcribe uploaded audio file
   *
   * @param {File} audioFile - Audio file to transcribe
   * @param {boolean} diarize - Whether to enable speaker diarization
   * @returns {Promise<{text: string, segments?: Array}>} Transcribed text with optional segments
   */
  async transcribeFile(audioFile, diarize = false) {
    const formData = new FormData();
    formData.append('audio', audioFile, audioFile.name);
    if (diarize) {
      formData.append('diarize', 'true');
    }

    // Get auth token for the request
    const token = await this.getToken();

    try {
      const response = await fetch(
        `${this.baseUrl}/api/tools/transcribe`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - browser sets it with boundary for multipart/form-data
          },
          body: formData,
        },
      );

      if (!response.ok) {
        // Try to extract error message from response body
        let errorMessage = `Transcription failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the default message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      return result;
    } catch (error) {
      // Re-throw with more context if it's a network error
      if (error.message === 'Failed to fetch') {
        throw new Error(
          'Network error: Unable to reach the transcription service. Please check your connection and try again.',
        );
      }
      throw error;
    }
  }

  /**
   * Get transcription history (if backend stores history)
   * @returns {Promise<Array>} List of past transcriptions
   */
  async getTranscriptionHistory() {
    const result = await this.send(
      `${this.baseUrl}/api/tools/transcribe/history`,
      'GET',
    );
    console.log('SpeechToTextApi: history result:', result);
    return result;
  }
}
