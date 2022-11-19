import { Grid, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { modifyReminder } from '../../../../store/reminders/reminderSlice';

export const ReminderSingleFrequencyFormSection = ({ handleFormChange }) => {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());

  const tryParseDate = (date) => {
    try {
      return date.toISOString();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (tryParseDate(date)) {
      dispatch(
        modifyReminder((reminder) => ({
          ...reminder,
          frequency: date.toISOString(),
        }))
      );
    }
  }, [date]);

  return (
    <>
      <Grid item lg={4}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            value={date ?? ''}
            name='frequency'
            onChange={(value) => setDate(value)}
            renderInput={(props) => <TextField {...props} />}
            label='DateTimePicker'
          />
        </LocalizationProvider>
      </Grid>
    </>
  );
};
