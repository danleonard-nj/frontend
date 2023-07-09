import autoBind from 'auto-bind';
import ChatGptApi from '../../api/chatGptApi';
import {
  getChatCompletionHistory,
  stripLeadingNewLineChars,
} from '../../api/helpers/chatGptHelpers';
import { toDateString } from '../../api/helpers/dateTimeUtils';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setChatMessages,
  setChatMessagesLoading,
  setConfigurationExpanded,
  setEngines,
  setEnginesLoading,
  setHistory,
  setHistoryChatIndex,
  setHistoryLoading,
  setHistoryRecordMessages,
  setImages,
  setIsHistoryViewEnabled,
  setMessage,
  setPrediction,
  setPredictionLoading,
  setUsage,
  setUsageLoading,
} from './chatGptSlice';
import { chatGptEndpoints } from '../../api/data/chatGpt';

const getBodyErrorMessage = (data) =>
  data?.response?.body?.error?.message;
const getBodyErrorType = (data) => data?.response?.body?.error?.tpe;
const getTotalTokenUsage = (data) =>
  data?.response?.body?.usage?.total_tokens;

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

export default class ChatGptActions {
  constructor() {
    this.chatGptApi = new ChatGptApi();
    autoBind(this);
  }

  rightHistoryDoubleArrowClick() {
    return (dispatch, getState) => {
      const { isHistoryViewEnabled, history } = getState().chatgpt;

      const chatHistory = getChatCompletionHistory(history);

      !isHistoryViewEnabled &&
        dispatch(setIsHistoryViewEnabled(true));

      const historyRecord = chatHistory[chatHistory.length - 1];

      dispatch(setHistoryChatIndex(chatHistory.length - 1));
      dispatch(
        setHistoryRecordMessages([
          ...historyRecord?.response?.request?.body?.messages,
          historyRecord?.response?.response?.body?.choices[0]
            ?.message,
        ])
      );
    };
  }

  rightHistoryArrowClick() {
    return (dispatch, getState) => {
      const { historyChatIndex, isHistoryViewEnabled, history } =
        getState().chatgpt;

      const chatHistory = getChatCompletionHistory(history);

      if (historyChatIndex === chatHistory?.length) {
        return;
      }

      !isHistoryViewEnabled &&
        dispatch(setIsHistoryViewEnabled(true));

      const currentIndex = historyChatIndex + 1;
      const historyRecord = chatHistory[currentIndex];

      dispatch(setHistoryChatIndex(currentIndex));
      dispatch(
        setHistoryRecordMessages([
          ...historyRecord?.response?.request?.body?.messages,
          historyRecord?.response?.response?.body?.choices[0]
            ?.message,
        ])
      );
    };
  }

  leftHistoryArrowClick() {
    return (dispatch, getState) => {
      const { historyChatIndex, isHistoryViewEnabled, history } =
        getState().chatgpt;

      if (historyChatIndex === 0) {
        return;
      }

      const chatHistory = getChatCompletionHistory(history);

      !isHistoryViewEnabled &&
        dispatch(setIsHistoryViewEnabled(true));

      const currentIndex = historyChatIndex - 1;
      const historyRecord = chatHistory[currentIndex];

      dispatch(setHistoryChatIndex(currentIndex));

      dispatch(
        setHistoryRecordMessages([
          ...historyRecord?.response?.request?.body?.messages,
          historyRecord?.response?.response?.body?.choices[0]
            ?.message,
        ])
      );
    };
  }

  getChat() {
    return async (dispatch, getState) => {
      const {
        message,
        chatMessages,
        tokens,
        selectedEngine,
        isConfigurationExpanded,
      } = getState().chatgpt;

      // Handle success/failure toasts and formatting
      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage('Failed to fetch chat completion')
          );
          // Error message in response body
        } else if (getBodyErrorMessage(data)) {
          dispatch(
            popErrorMessage(
              `Failed to fetch prediction: ${getBodyErrorType(
                data
              )}: ${getBodyErrorMessage(data)}`
            )
          );
        } else {
          return true;
        }
      };

      dispatch(setChatMessagesLoading(true));
      // Clear the message input
      dispatch(setMessage(''));

      const chatMessage = {
        role: 'user',
        content: message,
      };

      const outgoingMessages = [...chatMessages, chatMessage];
      dispatch(setChatMessages(outgoingMessages));

      const response = await this.chatGptApi.getChat(
        outgoingMessages,
        tokens,
        selectedEngine
      );

      if (handleResponse(response)) {
        const responseMessage =
          response?.data?.response?.body?.choices[0]?.message;

        dispatch(
          setChatMessages([...outgoingMessages, responseMessage])
        );
      }

      dispatch(setChatMessagesLoading(false));
    };
  }

  getPrediction() {
    return async (dispatch, getState) => {
      const {
        prompt,
        tokens,
        selectedEngine,
        isConfigurationExpanded,
      } = getState().chatgpt;

      dispatch(setPredictionLoading(true));

      // Handle success/failure toasts and formatting
      const handleResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch prediction'));
          // Error message in response body
        } else if (getBodyErrorMessage(data)) {
          dispatch(
            popErrorMessage(
              `Failed to fetch prediction: ${getBodyErrorType(
                data
              )}: ${getBodyErrorMessage(data)}`
            )
          );
        } else {
          // Result will usually lead with two new lines
          // TODO: Remove this on the backend?
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
              `Tokens used: ${getTotalTokenUsage(data) ?? 0}`
            )
          );
        }
      };

      const response = await this.chatGptApi.getPrediction(
        prompt,
        tokens,
        selectedEngine
      );

      handleResponse(response);
      dispatch(setPredictionLoading(false));
    };
  }

  isErrorResponseContent(response) {
    const message = response?.body?.error?.message;

    return message ? `` : false;
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
  getChat,
  leftHistoryArrowClick,
  rightHistoryArrowClick,
  rightHistoryDoubleArrowClick,
} = new ChatGptActions();
