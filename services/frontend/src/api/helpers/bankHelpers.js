const formatCurrency = (usageCents) => {
  const currencyFormatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
  });

  return currencyFormatter.format(usageCents);
};

const getDefaultDateRange = (daysBack) => {
  const now = new Date();

  const startDate = new Date();
  startDate.setDate(now.getDate() - daysBack);

  return {
    startDate: startDate,
    endDate: now,
  };
};

const dateParamsInitialized = (params) => {
  return params.startDate !== '' && params.endDate !== '';
};

const getGmailLink = (messageBk) => {
  return `https://mail.google.com/mail/u/0/#inbox/${messageBk}`;
};

export {
  formatCurrency,
  getDefaultDateRange,
  dateParamsInitialized,
  getGmailLink,
};
