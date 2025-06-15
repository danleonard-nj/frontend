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

  generateCalendarEvent(prompt) {
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
        const response = await this.calendarApi.generateCalendarEvent(
          prompt
        );

        response.status === 200
          ? handleSuccessResponse(response)
          : handleErrorResponse(response);
      } catch (error) {
        handleErrorResponse({
          data: error.message,
          status: 'Network Error',
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
        const response = await this.calendarApi.saveCalendarEvent(
          eventData
        );

        response.status === 200
          ? handleSuccessResponse(response)
          : handleErrorResponse(response);
      } catch (error) {
        handleErrorResponse({
          data: error.message,
          status: 'Network Error',
        });
      }

      dispatch(setIsSaving(false));
    };
  }
}

export const { generateCalendarEvent, saveCalendarEvent } =
  new CalendarActions();
