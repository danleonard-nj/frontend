import CheckIcon from '@mui/icons-material/Check';

const getTimestampHoursBack = (hoursBack) => {
  const hourAsSeconds = hoursBack * 60 * 60;
  const nowTimestamp = new Date().getTime() / 1000;
  return nowTimestamp - hourAsSeconds;
};

const getScheduleHistoryDisplayDateTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const scheduleHistoryColumns = [
  {
    field: 'triggerDate',
    headerName: 'Date',
    align: 'left',
    valueGetter: (params) =>
      new Date(params.value * 1000).toLocaleString(),
    flex: 0.25,
  },
  {
    field: 'isManualTrigger',
    headerName: 'Manual Trigger',
    flex: 0.25,
    renderCell: (params) => {
      console.log(params);
      return params.value ? <CheckIcon /> : <></>;
    },
  },
  {
    field: 'scheduleName',
    headerName: 'Schedule Name',
    flex: 0.25,
  },
  {
    field: 'scheduleId',
    headerName: 'Schedule ID',
    flex: 0.25,
  },
];

const transformScheduleHistoryData = (scheduleHistory) => {
  return scheduleHistory.map((history) => ({
    id: history.scheduleHistoryId,
    ...history,
  }));
};

const getAvailableLinkOptions = (tasks, links) =>
  tasks.filter((x) => !links.includes(x.taskId));

export {
  getTimestampHoursBack,
  getScheduleHistoryDisplayDateTime,
  scheduleHistoryColumns,
  transformScheduleHistoryData,
  getAvailableLinkOptions,
};
