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
  setCurrentAudioFile,
  setTranscriptionSegments,
} from './speechToTextSlice';

export default class SpeechToTextActions {
  constructor() {
    this.speechToTextApi = new SpeechToTextApi();
    autoBind(this);
  }

  /**
   * Transcribe audio blob and append to message
   * @param {Blob} audioBlob - Audio data to transcribe
   * @param {boolean} diarize - Whether to enable speaker diarization
   */
  transcribeAudio(audioBlob, diarize = false) {
    return async (dispatch, getState) => {
      dispatch(setIsTranscribing(true));
      dispatch(clearError());

      try {
        const response = await this.speechToTextApi.transcribeAudio(
          audioBlob,
          diarize,
        );

        if (response.text && response.text.trim()) {
          // Append transcribed text to message
          dispatch(appendToMessage(response.text));
          dispatch(setLastTranscription(response.text));

          // Store segments if diarization was enabled
          if (response.segments) {
            dispatch(setTranscriptionSegments(response.segments));
            // Store the audio blob as a file for playback
            const audioFile = new File(
              [audioBlob],
              'recording.webm',
              {
                type: audioBlob.type,
              },
            );
            dispatch(
              setCurrentAudioFile(URL.createObjectURL(audioFile)),
            );
          } else {
            dispatch(setTranscriptionSegments(null));
            dispatch(setCurrentAudioFile(null));
          }

          // Add to history if backend doesn't store it
          dispatch(
            addToHistory({
              text: response.text,
              timestamp: new Date().toISOString(),
              segments: response.segments,
            }),
          );
        }

        dispatch(setIsTranscribing(false));
        return response;
      } catch (error) {
        console.error('Transcription error:', error);
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
   */
  transcribeFile(audioFile, diarize = false) {
    return async (dispatch, getState) => {
      dispatch(setIsTranscribing(true));
      dispatch(clearError());

      try {
        const response = await this.speechToTextApi.transcribeFile(
          audioFile,
          diarize,
        );

        if (response.text && response.text.trim()) {
          // Append transcribed text to message
          dispatch(appendToMessage(response.text));
          dispatch(setLastTranscription(response.text));

          // Store segments if diarization was enabled
          if (response.segments) {
            dispatch(setTranscriptionSegments(response.segments));
            // Store the audio file URL for playback
            dispatch(
              setCurrentAudioFile(URL.createObjectURL(audioFile)),
            );
          } else {
            dispatch(setTranscriptionSegments(null));
            dispatch(setCurrentAudioFile(null));
          }

          // Add to history if backend doesn't store it
          dispatch(
            addToHistory({
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
        console.error('File transcription error:', error);
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
      console.log('getTranscriptionHistory action called...');
      dispatch(setTranscriptionHistoryLoading(true));

      try {
        console.log(
          'Making API call to get transcription history...',
        );
        const response =
          await this.speechToTextApi.getTranscriptionHistory();

        console.log('API response:', response);
        console.log('Response data:', response.data);
        console.log('Response status:', response.status);
        if (response.status === 200) {
          // Extract the transcriptions array and map field names
          const transcriptions = (
            response.data.transcriptions || []
          ).map((item) => ({
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
}

export const {
  transcribeAudio,
  transcribeFile,
  getTranscriptionHistory,
} = new SpeechToTextActions();
