import autoBind from 'auto-bind';
import SpeechToTextApi from '../../api/speechToTextApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setIsTranscribing,
  appendToMessage,
  setTranscriptionHistory,
  setTranscriptionHistoryLoading,
  addToHistory,
  setError,
  clearError,
  setLastTranscription,
  setLastTranscriptionId,
  setCurrentAudioFile,
  setTranscriptionSegments,
  setWaveformOverlay,
} from './speechToTextSlice';

export default class SpeechToTextActions {
  constructor() {
    this.speechToTextApi = new SpeechToTextApi();
    autoBind(this);
  }

  extractTranscriptionId(response) {
    return (
      response?.transcription_id ||
      response?._id ||
      response?.id ||
      response?.transcriptionId ||
      null
    );
  }

  async copyTextToClipboard(text) {
    if (
      !text ||
      typeof navigator === 'undefined' ||
      !navigator.clipboard?.writeText
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard write failures are non-blocking for transcription flow
    }
  }

  /**
   * Transcribe audio blob and append to message
   * @param {Blob} audioBlob - Audio data to transcribe
   * @param {boolean} diarize - Whether to enable speaker diarization
   * @param {boolean} returnWaveform - Whether to request waveform overlay image
   */
  transcribeAudio(
    audioBlob,
    diarize = false,
    returnWaveform = false,
    provider = null,
  ) {
    return async (dispatch, getState) => {
      dispatch(setIsTranscribing(true));
      dispatch(clearError());
      dispatch(setWaveformOverlay(null));
      dispatch(setLastTranscriptionId(null));

      try {
        const response = await this.speechToTextApi.transcribeAudio(
          audioBlob,
          diarize,
          returnWaveform,
          provider,
        );

        if (response.text && response.text.trim()) {
          const transcriptionId =
            this.extractTranscriptionId(response);

          // Append transcribed text to message
          dispatch(appendToMessage(response.text));
          dispatch(setLastTranscription(response.text));
          dispatch(setLastTranscriptionId(transcriptionId));
          await this.copyTextToClipboard(response.text);

          // Store the audio blob URL so the same playback controls work across flows
          const audioFile = new File([audioBlob], 'recording.webm', {
            type: audioBlob.type,
          });
          dispatch(
            setCurrentAudioFile(URL.createObjectURL(audioFile)),
          );

          // Store segments if diarization was enabled
          if (response.segments) {
            dispatch(setTranscriptionSegments(response.segments));
          } else {
            dispatch(setTranscriptionSegments(null));
          }

          // Store waveform overlay if returned
          if (response.waveform_overlay) {
            dispatch(setWaveformOverlay(response.waveform_overlay));
          }

          // Add to history if backend doesn't store it
          dispatch(
            addToHistory({
              transcriptionId,
              text: response.text,
              timestamp: new Date().toISOString(),
              segments: response.segments,
            }),
          );
        }

        dispatch(setIsTranscribing(false));
        return response;
      } catch (error) {
        dispatch(setError(error.message));
        dispatch(
          popErrorMessage(
            'Failed to transcribe audio. Please try again.',
          ),
        );
        dispatch(setIsTranscribing(false));
        throw error;
      }
    };
  }

  /**
   * Transcribe uploaded audio file
   * @param {File} audioFile - Audio file to transcribe
   * @param {boolean} diarize - Whether to enable speaker diarization
   * @param {boolean} returnWaveform - Whether to request waveform overlay image
   */
  transcribeFile(
    audioFile,
    diarize = false,
    returnWaveform = false,
    provider = null,
  ) {
    return async (dispatch, getState) => {
      dispatch(setIsTranscribing(true));
      dispatch(clearError());
      dispatch(setWaveformOverlay(null));
      dispatch(setLastTranscriptionId(null));

      try {
        const response = await this.speechToTextApi.transcribeFile(
          audioFile,
          diarize,
          returnWaveform,
          provider,
        );

        if (response.text && response.text.trim()) {
          const transcriptionId =
            this.extractTranscriptionId(response);

          // Append transcribed text to message
          dispatch(appendToMessage(response.text));
          dispatch(setLastTranscription(response.text));
          dispatch(setLastTranscriptionId(transcriptionId));
          await this.copyTextToClipboard(response.text);

          // Store the uploaded audio URL so playback controls appear for uploads too
          dispatch(
            setCurrentAudioFile(URL.createObjectURL(audioFile)),
          );

          // Store segments if diarization was enabled
          if (response.segments) {
            dispatch(setTranscriptionSegments(response.segments));
          } else {
            dispatch(setTranscriptionSegments(null));
          }

          // Store waveform overlay if returned
          if (response.waveform_overlay) {
            dispatch(setWaveformOverlay(response.waveform_overlay));
          }

          // Add to history if backend doesn't store it
          dispatch(
            addToHistory({
              transcriptionId,
              text: response.text,
              timestamp: new Date().toISOString(),
              filename: audioFile.name,
              segments: response.segments,
            }),
          );

          dispatch(
            popMessage('Audio file transcribed successfully!'),
          );
        }

        dispatch(setIsTranscribing(false));
        return response;
      } catch (error) {
        dispatch(setError(error.message));
        dispatch(
          popErrorMessage(
            'Failed to transcribe audio file. Please try again.',
          ),
        );
        dispatch(setIsTranscribing(false));
        throw error;
      }
    };
  }

  /**
   * Get transcription history from backend
   */
  getTranscriptionHistory() {
    return async (dispatch, getState) => {
      dispatch(setTranscriptionHistoryLoading(true));

      try {
        const response =
          await this.speechToTextApi.getTranscriptionHistory();
        if (response.status === 200) {
          // Extract the transcriptions array and map field names
          const transcriptions = (
            response.data.transcriptions || []
          ).map((item) => ({
            transcriptionId:
              item._id || item.transcription_id || item.id || null,
            text: item.transcribed_text,
            timestamp: item.created_date,
            _id: item._id,
            filename: item.filename,
            duration: item.duration,
            fileSize: item.file_size,
          }));
          console.log(
            'Setting transcription history:',
            transcriptions,
          );
          dispatch(setTranscriptionHistory(transcriptions));
        } else {
          console.log(
            'API call failed with status:',
            response.status,
          );
          dispatch(
            popErrorMessage('Failed to fetch transcription history'),
          );
        }

        dispatch(setTranscriptionHistoryLoading(false));
      } catch (error) {
        console.error('Failed to fetch history:', error);
        dispatch(setTranscriptionHistoryLoading(false));
      }
    };
  }

  submitTranscriptionFeedback(
    transcriptionId,
    reason = 'user_rejected_transcription',
    notes = null,
  ) {
    return async (dispatch, getState) => {
      try {
        const response =
          await this.speechToTextApi.submitTranscriptionFeedback(
            transcriptionId,
            reason,
            notes,
          );

        dispatch(popMessage('Transcription marked as bad.'));
        return response;
      } catch (error) {
        dispatch(
          popErrorMessage(
            error.message || 'Failed to mark transcription as bad.',
          ),
        );
        throw error;
      }
    };
  }
}

export const {
  transcribeAudio,
  transcribeFile,
  getTranscriptionHistory,
  submitTranscriptionFeedback,
} = new SpeechToTextActions();
