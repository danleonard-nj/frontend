import autoBind from 'auto-bind';
import ChatGptApi from '../../api/chatGptApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setEngines,
  setPrediction,
  setPredictionLoading,
} from './chatGptSlice';

const stripLeadingNewLineChars = (text) => {
  return text.replace(/^\n+/, '');
};

export default class ChatGptActions {
  constructor() {
    this.chatGptApi = new ChatGptApi();
    autoBind(this);
  }

  getPrediction() {
    return async (dispatch, getState) => {
      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch prediction'));
        } else {
          const result = stripLeadingNewLineChars(
            data?.response?.body?.choices[0]?.text
          );
          dispatch(setPrediction(result));
        }
      };

      dispatch(setPredictionLoading(true));

      const state = getState();
      const { prompt, tokens } = state.chatgpt;

      console.log('Prompt', prompt);

      const response = await this.chatGptApi.getPrediction(
        prompt,
        tokens
      );

      handleResponse(response);
      dispatch(setPredictionLoading(false));
    };
  }

  getEngines() {
    return async (dispatch, getState) => {
      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch engine list'));
        } else {
          dispatch(setEngines(data?.response?.body?.data));
        }
      };

      const response = this.chatGptApi.getEngines();

      handleResponse(response);
    };
  }
}

export const { getPrediction, getEngines } = new ChatGptActions();
