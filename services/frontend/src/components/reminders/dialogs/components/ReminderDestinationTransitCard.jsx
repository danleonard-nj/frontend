import { ConstructionOutlined } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { ArrivalType } from './ArrivalType';

export const ReminderTransitCard = () => {
  const destinationReminder = useSelector(
    (x) => x.reminders.reminder?.destination
  );

  return (
    <Card fullWidth>
      <CardHeader title='Transit' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={4}>
            <TextField
              fullWidth
              id='reminder-destination-transit-duration-textbox'
              label='Transit Duration'
              type='number'
              value={destinationReminder.transitDurationSeconds ?? ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              fullWidth
              id='reminder-destination-transit-distance-textbox'
              label='Transit Distance'
              name='transitDistanceMeters'
              type='number'
              value={destinationReminder.transitDistanceMeters ?? ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item lg={4}>
            <ArrivalType destinationReminder={destinationReminder} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
