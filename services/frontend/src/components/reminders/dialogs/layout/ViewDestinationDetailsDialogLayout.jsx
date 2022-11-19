import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReminderDepartureCard } from '../components/ReminderDepartureCard';
import { ReminderArrivalCard } from '../components/ReminderArrivalCard';
import { ViewReminderSchedulerCard } from '../components/ReminderScheduleCard';
import { ReminderNotificationViewCard } from '../components/ReminderNotificationViewCard';

export const ViewDestinationDetailsDialogLayout = () => {
  const reminder = useSelector((x) => x.reminders.reminder);

  const ViewReminderDestination = () => {
    return (
      <>
        <Grid item lg={12}>
          <ReminderDepartureCard destination={reminder?.destination} />
        </Grid>
        <Grid item lg={12}>
          <ReminderArrivalCard />
        </Grid>
      </>
    );
  };

  return (
    <Grid container spacing={2} sx={{ padding: 1 }}>
      <Grid item lg={12}>
        <ViewReminderSchedulerCard />
      </Grid>
      <Grid item lg={12}>
        <ReminderNotificationViewCard />
      </Grid>
      {reminder.reminderType == 'Destination' && <ViewReminderDestination />}
    </Grid>
  );
};
