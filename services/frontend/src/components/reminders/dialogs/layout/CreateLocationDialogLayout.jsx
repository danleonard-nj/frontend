import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setGeoLocation,
  setLocation,
} from '../../../../store/reminders/reminderSlice';
import config from '../../../../config.json';
import GoogleMaps, { MapsAutocomplete } from '../components/MapsAutocomplete';

export const CreateLocationDialogLayout = () => {
  const dispatch = useDispatch();
  const location = useSelector((x) => x.reminders.location) ?? {};
  const geoLocation = useSelector((x) => x.reminders.geoLocation) ?? {};

  const handleGetPlace = (place) => {
    dispatch(
      setLocation({
        ...location,
        locationAddress: place.formatted_address,
      })
    );
  };

  const handleChange = (event) => {
    dispatch(
      setLocation({
        ...location,
        [event.target.name]: event.target.value,
      })
    );
  };

  useEffect(() => {
    if (!geoLocation?.latitude || !geoLocation?.longitude) {
      navigator.geolocation.getCurrentPosition((coordinates) => {
        dispatch(
          setGeoLocation({
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
          })
        );
      });
    }
  });

  return (
    <Card>
      <CardHeader title='Location' />
      <CardContent style={{ overflowY: 'visible' }}>
        <Grid container spacing={2} sx={{ padding: 1 }}>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Location Name'
              name='locationName'
              onChange={handleChange}
              value={location.locationName}
            />
          </Grid>
          <Grid item lg={12}>
            <MapsAutocomplete getPlace={handleGetPlace} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
