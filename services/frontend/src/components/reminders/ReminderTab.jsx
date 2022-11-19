import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getLocations } from '../../store/reminders/locationActions';
import { ReminderForm } from './dialogs/components/ReminderCard';

export const CreateReminderForm = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLocations());
  }, []);

  return (
    <Grid container spacing={2} sx={{ padding: 1 }}>
      <Grid item lg={12}>
        <ReminderForm />
      </Grid>
    </Grid>
  );
};
