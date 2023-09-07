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

const getCountdownDisplay = (seconds) => {
  seconds = Number(seconds);

  var day = Math.floor(seconds / (3600 * 24));
  var hour = Math.floor((seconds % (3600 * 24)) / 3600);
  var min = Math.floor((seconds % 3600) / 60);
  var sec = Math.floor(seconds % 60);

  var dDisplay =
    day > 0 ? day + (day == 1 ? ' day, ' : ' days, ') : '';
  var hDisplay =
    hour > 0 ? hour + (hour == 1 ? ' hour, ' : ' hours, ') : '';
  var mDisplay =
    min > 0 ? min + (min == 1 ? ' minute, ' : ' minutes, ') : '';
  var sDisplay =
    sec > 0 ? sec + (sec == 1 ? ' second' : ' seconds') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

export {
  getLocalDateTimeFromString,
  getLocalDateTimeFromTimestamp,
  toDateString,
  normalizeDates,
  addDays,
  toLocalDateTime,
  getCountdownDisplay,
};
