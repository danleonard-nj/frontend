const scheduleTemplate = {
  cron: '* * * * *',
  lastRuntime: '',
  links: [],
  nextRuntime: '',
  queue: [],
  scheduleId: '',
  scheduleName: 'NewSchedule',
  includeSeconds: false,
};

const defaultSchedule = {
  cron: '',
  lastRuntime: '',
  links: [],
  nextRuntime: '',
  queue: [],
  scheduleId: '',
  scheduleName: '',
  includeSeconds: false,
};

const scheduleState = {
  schedules: [],
  schedule: defaultSchedule,
  schedulesLoading: true,
  scheduleLoading: false,
  linkOptions: [],
  isNew: false,
};

export { scheduleTemplate, defaultSchedule, scheduleState };
