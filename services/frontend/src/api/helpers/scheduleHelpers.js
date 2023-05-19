const getTimestampHoursBack = (hoursBack) => {
  const hourAsSeconds = hoursBack * 60 * 60;
  const nowTimestamp = new Date().getTime() / 1000;
  return nowTimestamp - hourAsSeconds;
};

const getScheduleHistoryDisplayDateTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

// Fetch and Populate schedule links
const handleGetScheduleWithLinks = (schedule, tasks) => {
  // Get schedules and list of all tasks not
  // linked to this task
  const links = tasks.filter((x) =>
    (schedule.links ?? []).includes(x.taskId)
  );
  return { ...schedule, links: links };
};

export {
  getTimestampHoursBack,
  getScheduleHistoryDisplayDateTime,
  handleGetScheduleWithLinks,
};
