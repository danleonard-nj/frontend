import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReminderFrequencyCronDescriptor } from '../components/ReminderFrequencyCronDescriptor';

export const ReminderCronFrequencyFormSection = ({
  reminder,
  handleFormChange,
}) => {
  return (
    <>
      <Grid item lg={4}>
        <TextField
          fullWidth
          label='Reminder Frequency'
          name='frequency'
          onChange={handleFormChange}
          value={reminder?.frequency ?? ''}
        />
      </Grid>
      <Grid item lg={4}>
        <ReminderFrequencyCronDescriptor />
      </Grid>
    </>
  );
};
