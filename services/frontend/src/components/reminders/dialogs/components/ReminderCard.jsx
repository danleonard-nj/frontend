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
import { useDispatch, useSelector } from 'react-redux';
import { setReminder } from '../../../../store/reminders/reminderSlice';

export const ReminderForm = () => {
  const dispatch = useDispatch();
  const reminder = useSelector((x) => x.reminders.reminder);
  const timezones = useSelector((x) => x.reminders.timezones);

  const handleFormChange = (event) => {
    dispatch(
      setReminder({ ...reminder, [event.target.name]: event.target.value })
    );
  };

  const handleFrequencyChange = (event) => {
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

  const handleSchedulerChange = (event) => {
    dispatch(
      setReminder({
        ...reminder,
        scheduler: {
          ...reminder.scheduler,
          [event.target.name]: event.target.value,
        },
      })
    );
  };

  console.log(reminder);

  return (
    <Card fullWidth>
      <CardHeader title='Reminder' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={3}>
            <TextField
              fullWidth
              label='Reminder Name'
              name='reminderName'
              onChange={handleFormChange}
              value={reminder?.reminderName ?? ''}
            />
          </Grid>
          <Grid item lg={3}>
            <FormControl fullWidth>
              <InputLabel id='select-reminder-type-label'>
                Reminder Type
              </InputLabel>
              <Select
                labelId='select-reminder-type-label'
                id='select-reminder-type'
                value={reminder?.reminderType ?? ''}
                label='Reminder Type'
                name='reminderType'
                onChange={handleFormChange}>
                <MenuItem value='Generic'>Generic</MenuItem>
                <MenuItem value='Destination'>Destination</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={3}>
            <FormControl fullWidth>
              <InputLabel id='select-frequency-type-label'>
                Frequency Type
              </InputLabel>
              <Select
                labelId='select-frequency-type-label'
                id='select-frequency-type'
                value={reminder?.frequency?.frequencyType ?? ''}
                label='Frequency Type'
                name='frequencyType'
                onChange={handleFrequencyChange}>
                <MenuItem value='Recurring'>Recurring</MenuItem>
                <MenuItem value='Once'>Once</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={3}>
            <FormControl fullWidth>
              <InputLabel id='select-timezone-label'>Timezone</InputLabel>
              <Select
                labelId='select-timezone-label'
                id='select-timezone'
                value={reminder?.scheduler?.timezone ?? ''}
                label='Timezone'
                name='timezone'
                onChange={handleSchedulerChange}>
                {timezones.map((timezone) => (
                  <MenuItem value={timezone.id} key={timezone.id}>
                    {timezone.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
