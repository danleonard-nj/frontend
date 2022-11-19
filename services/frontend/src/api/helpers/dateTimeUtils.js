const getLocalDateTimeFromString = (date) => {
  let localOffset = new Date().getTimezoneOffset() * 60 * 1000;

  const utcDateTime = new Date(date);
  let localDateTime = new Date(utcDateTime.getTime() + localOffset);

  return localDateTime.toLocaleString();
};

const getLocalDateTimeFromTimestamp = (timestamp) => {
  if (timestamp == 0) {
    return 'N/A';
  }
  return new Date(timestamp * 1000).toLocaleString();
};
const toDateString = (date) => {
  return date.toISOString().split('T')[0];
};

const normalizeDates = (data, selector) => {
  return data.map((doc) => ({
    ...doc,
    date: new Date(selector(doc)).toLocaleDateString(),
  }));
};

const addDays = (date, days) => {
  const modified = date.setDate(date.getDate() + days);
  return new Date(modified);
};

const toLocalDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString();
};

export {
  getLocalDateTimeFromString,
  getLocalDateTimeFromTimestamp,
  toDateString,
  normalizeDates,
  addDays,
  toLocalDateTime,
};
