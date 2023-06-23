const stripLeadingNewLineChars = (text) => {
  return text.replace(/^\n+/, '');
};

export { stripLeadingNewLineChars };
