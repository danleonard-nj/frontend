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
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications } from '../../../../store/reminders/notificationActions';
import { setReminder } from '../../../../store/reminders/reminderSlice';

export const ReminderNotificationEditCard = () => {
  const dispatch = useDispatch();
  const reminder = useSelector((x) => x.reminders.reminder);
  const notifications = useSelector((x) => x.reminders.notifications);

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

  const handleReminderNotificationChange = (event) => {
    dispatch(
      setReminder({
        ...reminder,
        notification: {
          ...reminder.notification,
          [event.target.name]: event.target.value,
        },
      })
    );
  };

  useEffect(() => {
    if (!notifications?.length) {
      dispatch(getNotifications());
    }
  }, []);

  return (
    <Card>
      <CardHeader title='Notifcation' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={3}>
            <FormControl fullWidth>
              <InputLabel id='select-notification-label'>
                Notification
              </InputLabel>
              <Select
                labelId='select-notification-label'
                id='select-notification'
                value={reminder?.notification?.notificationId ?? ''}
                label='Notification'
                name='notificationId'
                onChange={handleReminderNotificationChange}>
                {notifications.map((notification) => (
                  <MenuItem
                    key={notification.notificationId}
                    value={notification.notificationId}>
                    {notification.notificationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={3}>
            <TextField
              fullWidth
              id='reminder-destination-notification-window-textbox'
              label='Notification Window'
              type='number'
              onChange={handleReminderNotificationChange}
              name='notificationWindow'
              value={reminder?.notification?.notificationWindow ?? ''}
            />
          </Grid>
          {reminder.frequency.frequencyType == 'Recurring' && (
            <>
              <Grid item lg={3}>
                <TextField
                  fullWidth
                  id='reminder-destination-notification-interval-textbox'
                  label='Notification Interval'
                  type='number'
                  onChange={handleReminderNotificationChange}
                  name='notificationInterval'
                  value={reminder?.notification?.notificationInterval ?? ''}
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  fullWidth
                  id='reminder-destination-notification-arrival-window-textbox'
                  label='Arrival Window'
                  type='number'
                  onChange={handleChange}
                  name='onTimeArrivalWindow'
                  value={reminder?.destination?.onTimeArrivalWindow ?? ''}
                />
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
