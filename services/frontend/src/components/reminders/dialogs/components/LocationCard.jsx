import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReminder } from '../../../../store/reminders/reminderSlice';

export const LocationCard = () => {
  const reminder = useSelector((x) => x.reminders.reminder);
  const locations = useSelector((x) => x.reminders.locations);
  const reminderDestination = useSelector(
    (x) => x.reminders.reminder?.destination
  );
  const dispatch = useDispatch();

  console.log('reminder destination');
  console.log(reminderDestination);

  const handleChange = (event) => {
    dispatch(
      setReminder({
        ...reminder,
        destination: {
          ...reminder.destination,
          [event.target.name]: event.target.value,
        },
      })
    );
  };

  const handleUpdateIntervalChange = (event) => {
    dispatch(
      setReminder({
        ...reminder,
        destination: {
          ...reminder.destination,
          transit: {
            ...reminder.destination.transit,
            [event.target.name]: event.target.value,
          },
        },
      })
    );
  };

  return (
    <Card fullWidth>
      <CardHeader title='Destination' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={4}>
            <FormControl fullWidth>
              <InputLabel id='select-reminder-origin-location-label'>
                Origin
              </InputLabel>
              <Select
                labelId='select-reminder-origin-location-label'
                id='select-reminder-origin-location'
                value={reminderDestination?.originId ?? ''}
                label='Origin'
                name='originId'
                onChange={(event) => handleChange(event)}>
                {locations.map((location) => (
                  <MenuItem value={location.locationId}>
                    {location.locationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4}>
            <FormControl fullWidth>
              <InputLabel id='select-reminder-destination-location-label'>
                Destination
              </InputLabel>
              <Select
                labelId='select-reminder-destination-location-label'
                id='select-reminder-destination-location'
                value={reminderDestination?.destinationId ?? ''}
                label='Destination'
                name='destinationId'
                onChange={(event) => handleChange(event)}>
                {locations.map((location) => (
                  <MenuItem value={location.locationId}>
                    {location.locationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4}>
            <TextField
              fullWidth
              label='Update Interval'
              name='updateInterval'
              type='number'
              onChange={(event) => handleUpdateIntervalChange(event)}
              value={reminderDestination?.transit?.updateInterval ?? ''}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
