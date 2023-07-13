import { chatGptEndpoints } from '../data/chatGpt';
import { toDateString } from './dateTimeUtils';

const stripLeadingNewLineChars = (text) => {
  return text.replace(/^\n+/, '');
};

const getChatMessageColor = (role) => {
  return role === 'user' ? 'primary' : 'info';
};

const getChatCompletionHistory = (history) => {
  return history.filter(
    (x) => x.endpoint === chatGptEndpoints.chatCompletions
  );
};

const getBodyErrorMessage = (data) => {
  return data?.response?.body?.error?.message;
};

const getBodyErrorType = (data) => {
  return data?.response?.body?.error?.tpe;
};

const getTotalTokenUsage = (data) => {
  return data?.response?.body?.usage?.total_tokens;
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

const formatCurrency = (usageCents) => {
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

export {
  stripLeadingNewLineChars,
  getChatMessageColor,
  getChatCompletionHistory,
  getDaysFromToday,
  addDays,
  formatCurrency,
  getStartOfMonthDate,
  getBodyErrorMessage,
  getBodyErrorType,
  getTotalTokenUsage,
};
