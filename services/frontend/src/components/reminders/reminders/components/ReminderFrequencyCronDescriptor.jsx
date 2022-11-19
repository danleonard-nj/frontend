import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCronDescriptor } from '../../../../store/reminders/reminderActions';

export const ReminderFrequencyCronDescriptor = () => {
  const dispatch = useDispatch();
  const frequency = useSelector((x) => x.reminders.reminder.frequency);
  const cronDescriptor = useSelector((x) => x.reminders.cronDescriptor);

  useEffect(() => {
    dispatch(getCronDescriptor(frequency));
  }, [frequency]);

  return (
    <TextField
      fullWidth
      id='outlined-read-only-input'
      label='Descriptor'
      value={cronDescriptor ?? ''}
      InputProps={{
        readOnly: true,
      }}
    />
  );
};
