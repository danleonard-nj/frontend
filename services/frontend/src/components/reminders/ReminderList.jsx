import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../api/helpers/formattingHelpers';
import { getReminders } from '../../store/reminders/reminderActions';
import { setReminder } from '../../store/reminders/reminderSlice';

export default function ReminderList() {
  const dispatch = useDispatch();
  const reminders = useSelector((x) => x.reminders.reminders) ?? {};

  useEffect(() => {
    dispatch(getReminders());
  }, []);

  const handleReminderSelect = (reminder) => {
    dispatch(setReminder(reminder));
  };

  return (
    <Paper elevation={2}>
      <List component='nav' sx={scrollable}>
        {reminders?.length &&
          reminders.map((item) => (
            <ListItemButton
              key={item.reminder_name}
              onClick={() => handleReminderSelect(item)}>
              <ListItemIcon>
                <CircleNotificationsIcon />
              </ListItemIcon>
              <ListItemText primary={item.reminder_name} />
            </ListItemButton>
          ))}
      </List>
    </Paper>
  );
}
