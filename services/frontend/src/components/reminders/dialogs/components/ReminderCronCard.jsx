import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { React, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCronDescriptor } from '../../../../store/reminders/reminderActions';
import { setReminder } from '../../../../store/reminders/reminderSlice';

export const ReminderCronCard = () => {
  const dispatch = useDispatch();
  const reminder = useSelector((x) => x.reminders.reminder) ?? {};
  const cronDescriptor = useSelector((x) => x.reminders.cronDescriptor);

  const [date, setDate] = useState(reminder.frequency.trigger);

  const getTitle = () => {
    return reminder.frequency.frequencyType == 'Recurring' ? 'CRON' : 'Trigger';
  };

  const handleFormChange = (event) => {
    dispatch(
      setReminder({
        ...reminder,
        frequency: {
          ...reminder.frequency,
          [event.target.name]: event.target.value,
        },
      })
    );
  };

  const updateCron = () => {
    dispatch(getCronDescriptor(reminder?.frequency?.cron));
  };

  const updateTrigger = (value) => {
    dispatch(
      setReminder({
        ...reminder,
        frequency: {
          ...reminder.frequency,
          trigger: value,
        },
      })
    );
  };

  const getReminderTrigger = () => {
    if (!reminder.frequency.trigger) {
      return new Date().toISOString();
    }

    return reminder.frequency.trigger;
  };

  return (
    <Card fullWidth>
      <CardHeader title={getTitle()} />
      <CardContent>
        <Grid container spacing={3}>
          (
          <>
            {reminder.frequency.frequencyType == 'Once' && (
              <Grid item lg={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label='DateTimePicker'
                    value={getReminderTrigger()}
                    onChange={(newValue) => {
                      updateTrigger(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            )}

            {reminder.frequency.frequencyType == 'Recurring' && (
              <>
                <Grid item lg={3}>
                  <TextField
                    fullWidth
                    id='outlined-read-only-input'
                    label='Descriptor'
                    value={cronDescriptor ?? ''}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item lg={3}>
                  <TextField
                    fullWidth
                    label='Reminder Trigger'
                    name='cron'
                    onChange={handleFormChange}
                    value={reminder?.frequency?.cron ?? ''}
                  />
                </Grid>
                <Grid item lg={3} sx={{ marginY: 'auto' }}>
                  <Button variant='contained' onClick={updateCron}>
                    Update
                  </Button>
                </Grid>
              </>
            )}
          </>
        </Grid>
      </CardContent>
    </Card>
  );
};
