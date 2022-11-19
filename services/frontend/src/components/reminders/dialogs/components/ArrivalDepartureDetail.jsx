import { Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { React } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReminder } from '../../../../store/reminders/reminderSlice';
import { ArrivalType } from './ArrivalType';

export const ArrivalDepartureDetail = () => {
  const dispatch = useDispatch();
  const reminder = useSelector((x) => x.reminders.reminder);
  const destinationReminder =
    useSelector((x) => x.reminders.reminder?.destination) ?? {};

  const handleFormChange = (event) => {
    dispatch(
      setReminder({ ...reminder, [event.target.name]: event.target.value })
    );
  };

  return (
    <Card fullWidth>
      <CardHeader title='Arrival & Departure' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={6}>
            <TextField
              fullWidth
              id='reminder-destination-transit-arrival-type-textbox'
              label='Arrival Type'
              name='arrivalType'
              value={destinationReminder?.arrival?.arrivalType ?? ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item lg={6}>
            <ArrivalType destinationReminder={destinationReminder} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
