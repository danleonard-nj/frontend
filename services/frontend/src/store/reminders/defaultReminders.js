const defaultDestinationReminder = {
  destination: {
    originId: '',
    destinationId: '',
    onTimeArrivalWindow: 0,
    transit: {
      updateInterval: 0,
    },
  },
  reminderName: 'New Reminder',
  reminderType: 'Destination',
  expirationTimestamp: 0,
  frequency: {
    frequencyType: 'Recurring',
    cron: '* * * * *',
  },
  notification: {
    notificationType: 'Recurring',
    notificationInterval: 600,
    notificationWindow: 3600,
    notificationId: '',
  },
  scheduler: {
    timezone: 'America/Phoenix',
  },
};

export { defaultDestinationReminder };
