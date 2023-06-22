import autoBind from 'auto-bind';
import ChatGptApi from '../../api/chatGptApi';
import { toDateString } from '../../api/helpers/dateTimeUtils';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setConfigurationExpanded,
  setEngines,
  setEnginesLoading,
  setHistoryEndpoints,
  setHistoryEndpointsLoading,
  setImages,
  setPrediction,
  setPredictionLoading,
  setUsage,
  setUsageLoading,
} from './chatGptSlice';
import { setHistoryLoading } from './chatGptSlice';
import { setHistory } from './chatGptSlice';

const stripLeadingNewLineChars = (text) => {
  return text.replace(/^\n+/, '');
};

const getStartOfMonthDate = () => {
  const today = new Date();
  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  return toDateString(startOfMonth);
};

const formatUsageCents = (usageCents) => {
  const currencyFormatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
  });

  return currencyFormatter.format(usageCents / 100);
};

const addDays = (date, days) => {
  const modified = date.setDate(date.getDate() + days);
  return new Date(modified);
};

const getDaysFromToday = (days) => {
  var date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const getTimestampFromDateString = (date) => {
  return new Date(date).getTime() / 1000;
};

export default class ChatGptActions {
  constructor() {
    this.chatGptApi = new ChatGptApi();
    autoBind(this);
  }

  getPrediction() {
    return async (dispatch, getState) => {
      const {
        prompt,
        tokens,
        selectedEngine,
        isConfigurationExpanded,
      } = getState().chatgpt;

      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch prediction'));
        } else {
          const result = stripLeadingNewLineChars(
            data?.response?.body?.choices[0]?.text
          );

          dispatch(setPrediction(result));

          // Collapse the configuration accordian
          // if it is expanded
          if (isConfigurationExpanded) {
            dispatch(setConfigurationExpanded(false));
          }

          // Display token usage for prediction
          dispatch(
            popMessage(
              `Tokens used: ${
                data?.response?.body?.usage?.total_tokens ?? 0
              }`
            )
          );
        }
      };

      dispatch(setPredictionLoading(true));

      const response = await this.chatGptApi.getPrediction(
        prompt,
        tokens,
        selectedEngine
      );

      handleResponse(response);
      dispatch(setPredictionLoading(false));
    };
  }

  getImages() {
    return async (dispatch, getState) => {
      const {
        prompt,
        imageRepetitions,
        imageSize,
        isConfigurationExpanded,
      } = getState().chatgpt;

      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to generate image'));
        } else {
          dispatch(setImages(data?.response?.body?.data));

          // Collapse the configuration accordian
          // if it is expanded
          if (isConfigurationExpanded) {
            dispatch(setConfigurationExpanded(false));
          }
        }
      };

      dispatch(setPredictionLoading(true));

      console.log('Prompt', prompt);

      const response = await this.chatGptApi.getImage(
        prompt,
        parseInt(imageRepetitions),
        imageSize
      );

      handleResponse(response);
      dispatch(setPredictionLoading(false));
    };
  }

  getEngines() {
    return async (dispatch, getState) => {
      const handleResponse = ({ status, data }) => {
        if (status !== 200 || data?.response?.status_code !== 200) {
          dispatch(popErrorMessage('Failed to fetch engine list'));
        } else {
          // Get the engine list
          const engines = data?.response?.body?.data ?? [];

          // Sort engines by name
          const sortedEngines = engines.sort((a, b) =>
            a.id.localeCompare(b.id)
          );

          dispatch(setEngines(sortedEngines));
        }
      };

      // Set engines loading flag
      dispatch(setEnginesLoading(true));
      const response = await this.chatGptApi.getEngines();

      handleResponse(response);

      // Clear engines loading flag
      dispatch(setEnginesLoading(false));
    };
  }

  getUsage(startDate = null, endDate = null) {
    return async (dispatch, getState) => {
      const handleResponse = ({ status, data }) => {
        if (status !== 200 || data?.response?.status_code !== 200) {
          dispatch(popErrorMessage('Failed to fetch usage data'));
        } else {
          // Get the usage data formatted as currency
          const totalUsage = formatUsageCents(
            data?.response?.body?.total_usage ?? 0
          );

          dispatch(setUsage(totalUsage));
        }
      };

      // Default start date to first day of month
      if (!startDate) {
        startDate = getStartOfMonthDate();
      }

      // Default end date to today
      if (!endDate) {
        endDate = toDateString(getDaysFromToday(1));
      }

      // Set engines loading flag
      dispatch(setUsageLoading(true));
      const response = await this.chatGptApi.getUsage(
        startDate,
        endDate
      );

      console.log('Usage', response);

      handleResponse(response);

      // Clear engines loading flag
      dispatch(setUsageLoading(false));
    };
  }

  getHistory(daysBack, endpointFilter = null) {
    return async (dispatch, getState) => {
      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch history data'));
        } else {
          dispatch(setHistory(data ?? []));
        }
      };

      // Calculate start timestamp from days back
      const startDate = addDays(new Date(), parseInt(daysBack) * -1);
      const startTimestamp = parseInt(startDate.getTime() / 1000);

      // Set history loading flag
      dispatch(setHistoryLoading(true));

      const response = await this.chatGptApi.getHistoryEndpoints(
        startTimestamp,
        endpointFilter
      );

      handleResponse(response);

      // Clear history loading flag
      dispatch(setHistoryLoading(false));
    };
  }
}

export const {
  getPrediction,
  getImages,
  getEngines,
  getUsage,
  getHistory,
} = new ChatGptActions();
