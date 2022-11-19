import { Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLocalDateTimeFromTimestamp } from '../../../../api/helpers/dateTimeUtils';

export const ReminderNotificationViewCard = () => {
  const reminder = useSelector((x) => x.reminders?.reminder) ?? {};

  return (
    <Card fullWidth>
      <CardHeader title='Notifications' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Notification Window Start'
              name='localNotificationWindowStart'
              value={
                getLocalDateTimeFromTimestamp(
                  reminder?.scheduler?.notificationWindowStart
                ) ?? ''
              }
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Last Notification'
              name='lastNotification'
              value={
                getLocalDateTimeFromTimestamp(
                  reminder?.scheduler?.lastNotification
                ) ?? ''
              }
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Next Notification'
              name='nextNotification'
              value={
                getLocalDateTimeFromTimestamp(
                  reminder?.scheduler?.nextNotification
                ) ?? ''
              }
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
