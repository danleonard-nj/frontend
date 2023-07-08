const stripLeadingNewLineChars = (text) => {
  return text.replace(/^\n+/, '');
};

const getChatMessageColor = (role) => {
  return role === 'user' ? 'primary' : 'info';
};

export { stripLeadingNewLineChars, getChatMessageColor };
