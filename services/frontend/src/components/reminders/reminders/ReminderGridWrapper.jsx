import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getLocations } from '../../../store/reminders/locationActions';
import {
  getReminders,
  getTimezones,
} from '../../../store/reminders/reminderActions';
import { ReminderGrid } from './ReminderGrid';

export const ReminderGridWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReminders());
    dispatch(getLocations());
    dispatch(getTimezones());
  }, []);

  return <ReminderGrid />;
};
