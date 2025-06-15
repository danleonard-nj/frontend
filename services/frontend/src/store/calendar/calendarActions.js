// services/frontend/src/store/calendar/calendarActions.js
import autoBind from 'auto-bind';
import CalendarApi from '../../api/calendarApi';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setGeneratedEvent,
  setIsGenerating,
  setIsSaving,
  setLastSavedEvent,
  setError,
  clearError,
} from './calendarSlice';

export default class CalendarActions {
  constructor() {
    this.calendarApi = new CalendarApi();
    autoBind(this);
  }

  generateCalendarEvent(data) {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data, status }) => {
        const errorMessage = `${status}: Failed to generate calendar event: ${getErrorMessage(
          data
        )}`;
        dispatch(setError(errorMessage));
        dispatch(popErrorMessage(errorMessage));
      };

      const handleSuccessResponse = ({ data }) => {
        console.log(
          'CalendarActions - handleSuccessResponse - data:',
          data
        );
        dispatch(setGeneratedEvent(data));
        dispatch(clearError());
      };

      dispatch(setIsGenerating(true));
      dispatch(clearError());

      try {
        // Validate input data
        let hasContent = false;

        if (typeof data === 'string') {
          // Legacy format - just a prompt string
          hasContent = data.trim().length > 0;
        } else if (typeof data === 'object') {
          // New format - object with prompt and images
          const { prompt = '', images = [] } = data;
          hasContent = prompt.trim().length > 0 || images.length > 0;

          if (!hasContent) {
            throw new Error(
              'Please provide either a text description or upload images'
            );
          }
        } else {
          throw new Error('Invalid input format');
        }

        if (!hasContent) {
          throw new Error(
            'Please provide a description for the calendar event'
          );
        }

        const response = await this.calendarApi.generateCalendarEvent(
          data
        );

        response.status === 200
          ? handleSuccessResponse(response)
          : handleErrorResponse(response);
      } catch (error) {
        console.error('Calendar generation error:', error);
        handleErrorResponse({
          data: error.message || 'Unknown error occurred',
          status: 'Client Error',
        });
      }

      dispatch(setIsGenerating(false));
    };
  }

  saveCalendarEvent(eventData) {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data, status }) => {
        const errorMessage = `${status}: Failed to save calendar event: ${getErrorMessage(
          data
        )}`;
        dispatch(setError(errorMessage));
        dispatch(popErrorMessage(errorMessage));
      };

      const handleSuccessResponse = ({ data }) => {
        dispatch(setLastSavedEvent(data));
        dispatch(popMessage('Calendar event saved successfully!'));
        dispatch(clearError());
      };

      dispatch(setIsSaving(true));
      dispatch(clearError());

      try {
        // Validate event data
        if (!eventData || !eventData.summary) {
          throw new Error('Event must have a title');
        }

        const response = await this.calendarApi.saveCalendarEvent(
          eventData
        );

        response.status === 200
          ? handleSuccessResponse(response)
          : handleErrorResponse(response);
      } catch (error) {
        console.error('Calendar save error:', error);
        handleErrorResponse({
          data: error.message || 'Unknown error occurred',
          status: 'Client Error',
        });
      }

      dispatch(setIsSaving(false));
    };
  }

  // Helper action to clear images and reset form
  resetCalendarForm() {
    return async (dispatch) => {
      dispatch(clearError());
      // Could add additional cleanup logic here if needed
    };
  }
}

export const {
  generateCalendarEvent,
  saveCalendarEvent,
  resetCalendarForm,
} = new CalendarActions();
