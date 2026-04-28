import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';

const MIME_EXTENSION_MAP = {
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/wave': 'wav',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/flac': 'flac',
};

/**
 * Derive a sensible filename + extension from a Blob/File's MIME type so the
 * backend can route the audio to the right decoder.
 */
function filenameForBlob(blob, fallbackBase = 'audio') {
  const rawType = (blob?.type || '')
    .toLowerCase()
    .split(';')[0]
    .trim();
  let ext = MIME_EXTENSION_MAP[rawType];
  if (!ext && rawType.startsWith('audio/')) {
    ext = rawType.slice('audio/'.length).replace(/^x-/, '');
  }
  if (!ext) {
    ext = 'webm';
  }
  return {
    filename: `${fallbackBase}.${ext}`,
    mimeType: rawType || `audio/${ext}`,
  };
}

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
  async transcribeAudio(
    audioBlob,
    diarize = false,
    returnWaveform = false,
    provider = null,
  ) {
    const formData = new FormData();
    const { filename } = filenameForBlob(audioBlob, 'recording');
    formData.append('audio', audioBlob, filename);
    if (diarize) {
      formData.append('diarize', 'true');
    }
    if (returnWaveform) {
      formData.append('return_waveform', 'true');
    }
    if (provider && provider !== 'default') {
      formData.append('provider', provider);
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
  async transcribeFile(
    audioFile,
    diarize = false,
    returnWaveform = false,
    provider = null,
  ) {
    const formData = new FormData();
    formData.append('audio', audioFile, audioFile.name);
    if (diarize) {
      formData.append('diarize', 'true');
    }
    if (returnWaveform) {
      formData.append('return_waveform', 'true');
    }
    if (provider && provider !== 'default') {
      formData.append('provider', provider);
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

  /**
   * Submit negative feedback for a transcription run
   * @param {string} transcriptionId
   * @param {string} reason
   * @param {string|null} notes
   * @returns {Promise<{status: string, audio_retained: boolean}>}
   */
  async submitTranscriptionFeedback(
    transcriptionId,
    reason = 'user_rejected_transcription',
    notes = null,
  ) {
    const { status, data, isSuccess } = await this.send(
      `${this.baseUrl}/api/tools/transcription/feedback/${transcriptionId}`,
      'POST',
      {
        reason,
        notes,
      },
    );

    if (!isSuccess) {
      let errorMessage = 'Failed to submit transcription feedback.';
      try {
        if (data?.error) {
          errorMessage = data.error;
        }
      } catch {
        // Use default error message when response body is not JSON
      }
      throw new Error(errorMessage);
    }

    return data;
  }
}
