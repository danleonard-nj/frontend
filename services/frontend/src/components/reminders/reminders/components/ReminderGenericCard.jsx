import { Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setReminder } from '../../../../store/reminders/reminderSlice';

export const ReminderGenericCard = () => {
  const dispatch = useDispatch();
  const reminder = useSelector((x) => x.reminders.reminder);

  const handleMessageChange = (event) => {
    dispatch(
      setReminder({
        ...reminder,
        generic: { ...reminder.generic, message: event.target.value },
      })
    );
  };

  return (
    <Card fullWidth>
      <CardHeader title='Generic' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Message'
              name='message'
              onChange={handleMessageChange}
              value={reminder?.generic?.message ?? ''}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
