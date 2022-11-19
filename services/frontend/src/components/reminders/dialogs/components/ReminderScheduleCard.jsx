import { Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLocalDateTimeFromTimestamp } from '../../../../api/helpers/dateTimeUtils';

export const ViewReminderSchedulerCard = () => {
  const reminder = useSelector((x) => x.reminders?.reminder) ?? {};

  const LastTransitUpdate = () => {
    return (
      <Grid item lg={12}>
        <TextField
          fullWidth
          label='Last Direction Update'
          name='localNotificationWindowStart'
          value={
            getLocalDateTimeFromTimestamp(
              reminder?.destination?.transit?.lastUpdate
            ) ?? ''
          }
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
    );
  };

  return (
    <Card fullWidth>
      <CardHeader title='Scheduler' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Next Occurence'
              name='localNotificationWindowStart'
              value={
                getLocalDateTimeFromTimestamp(
                  reminder?.scheduler?.nextCronOccurence
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
              label='Frequency'
              name='frequencyType'
              value={reminder?.frequency?.frequencyType ?? ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          {reminder.reminderType == 'Destination' && <LastTransitUpdate />}
        </Grid>
      </CardContent>
    </Card>
  );
};
