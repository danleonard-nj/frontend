import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocations } from '../../../../store/reminders/locationActions';
import { ReminderGenericCard } from '../../reminders/components/ReminderGenericCard';
import { ReminderCronCard } from '../components/ReminderCronCard';
import { LocationCard } from '../components/LocationCard';
import { ReminderForm as ReminderEditCard } from '../components/ReminderCard';
import { ReminderNotificationEditCard } from '../components/ReminderNotificationEditCard';

export const EditReminderDialogLayout = () => {
  const dispatch = useDispatch();
  const reminder = useSelector((x) => x.reminders.reminder);

  useEffect(() => {
    dispatch(getLocations());
  }, []);

  return (
    <Grid container spacing={2} sx={{ padding: 1 }}>
      <Grid item lg={12}>
        <ReminderEditCard />
      </Grid>
      <Grid item lg={12}>
        <ReminderCronCard />
      </Grid>
      <Grid item lg={12}>
        <ReminderNotificationEditCard />
      </Grid>
      <Grid item lg={12}>
        {reminder.reminderType == 'Generic' && <ReminderGenericCard />}
        {reminder.reminderType == 'Destination' && <LocationCard />}
      </Grid>
    </Grid>
  );
};
