import autoBind from 'auto-bind';
import SpeechToTextApi from '../../api/speechToTextApi';
import {
  popErrorMessage,
  popSuccessMessage,
} from '../alert/alertActions';
import {
  setIsTranscribing,
  appendToMessage,
  setTranscriptionHistory,
  setTranscriptionHistoryLoading,
  addToHistory,
  setError,
  clearError,
  setLastTranscription,
} from './speechToTextSlice';

export default class SpeechToTextActions {
  constructor() {
    this.speechToTextApi = new SpeechToTextApi();
    autoBind(this);
  }

  /**
   * Transcribe audio blob and append to message
   * @param {Blob} audioBlob - Audio data to transcribe
   */
  transcribeAudio(audioBlob) {
    return async (dispatch, getState) => {
      dispatch(setIsTranscribing(true));
      dispatch(clearError());

      try {
        const response = await this.speechToTextApi.transcribeAudio(
          audioBlob
        );

        if (response.text && response.text.trim()) {
          // Append transcribed text to message
          dispatch(appendToMessage(response.text));
          dispatch(setLastTranscription(response.text));

          // Add to history if backend doesn't store it
          dispatch(
            addToHistory({
              text: response.text,
              timestamp: new Date().toISOString(),
            })
          );
        }

        dispatch(setIsTranscribing(false));
        return response;
      } catch (error) {
        console.error('Transcription error:', error);
        dispatch(setError(error.message));
        dispatch(
          popErrorMessage(
            'Failed to transcribe audio. Please try again.'
          )
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
          dispatch(setTranscriptionHistory(response.data));
        } else {
          dispatch(
            popErrorMessage('Failed to fetch transcription history')
          );
        }

        dispatch(setTranscriptionHistoryLoading(false));
      } catch (error) {
        console.error('Failed to fetch history:', error);
        dispatch(setTranscriptionHistoryLoading(false));
      }
    };
  }
}

export const { transcribeAudio, getTranscriptionHistory } =
  new SpeechToTextActions();
