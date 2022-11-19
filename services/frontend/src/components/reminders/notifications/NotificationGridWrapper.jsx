import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getNotifications } from '../../../store/reminders/notificationActions';
import { NotificationGrid } from './NotificationGrid';

export const NotificationGridComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotifications());
  }, []);

  return <NotificationGrid />;
};
