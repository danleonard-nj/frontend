import { Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLocalDateTimeFromTimestamp } from '../../../../api/helpers/dateTimeUtils';

export const ReminderArrivalCard = () => {
  const reminder = useSelector((x) => x.reminders?.reminder) ?? {};

  return (
    <Card fullWidth>
      <CardHeader title='Arrival' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Arrival (Immediate Departure)'
              name='estimatedArrivalTimestamp'
              value={
                getLocalDateTimeFromTimestamp(
                  reminder?.destination?.arrival?.estimatedTimestamp
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
              label='On-Time Arrival (Left Bound)'
              name='localNotificationWindowStart'
              value={
                reminder?.destination?.arrival?.onTimeArrivalWindowLeftBound ??
                ''
              }
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='On-Time Arrival (Right Bound)'
              name='localOnTimeArrivalRightBound'
              value={
                reminder?.destination?.arrival?.onTimeArrivalWindowRightBound ??
                ''
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
