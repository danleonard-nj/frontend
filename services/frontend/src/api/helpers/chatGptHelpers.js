import { chatGptEndpoints } from '../data/chatGpt';

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

export {
  stripLeadingNewLineChars,
  getChatMessageColor,
  getChatCompletionHistory,
};
