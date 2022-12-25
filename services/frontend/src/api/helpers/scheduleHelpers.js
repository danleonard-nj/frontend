const getTimestampHoursBack = (hoursBack) => {
  const hourAsSeconds = hoursBack * 60 * 60;
  const nowTimestamp = new Date().getTime() / 1000;
  return nowTimestamp - hourAsSeconds;
};

const getScheduleHistoryDisplayDateTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

export { getTimestampHoursBack, getScheduleHistoryDisplayDateTime };
