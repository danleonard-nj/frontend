import { Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLocalDateTimeFromTimestamp } from '../../../../api/helpers/dateTimeUtils';

export const ReminderDepartureCard = () => {
  const reminder = useSelector((x) => x.reminders?.reminder) ?? {};

  return (
    <Card fullWidth>
      <CardHeader title='Departure' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Scheduled Departure'
              name='estimatedDepartureTimestamp'
              value={
                getLocalDateTimeFromTimestamp(
                  reminder?.destination?.departure?.estimatedTimestamp
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
