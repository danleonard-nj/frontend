import NotificationsApi from '../../api/reminders/notificationsApi';
import { setNotification, setNotifications } from './reminderSlice';

export function getNotifications() {
  return async (dispatch, getState) => {
    const api = new NotificationsApi();

    const notifications = await api.getNotifications();
    dispatch(setNotifications(notifications));
  };
}

export function setSelectedNotification(notificationId) {
  return async (dispatch, getState) => {
    const state = getState();

    const notification = state.reminders.notifications.find(
      (x) => x.notificationId == notificationId
    );

    dispatch(setNotification(notification));
  };
}

export function deleteNotification(notificationId) {
  return async (dispatch, getState) => {
    const api = new NotificationsApi();
    const state = getState();

    const updatedNotifications = state.reminders.notifications.filter(
      (x) => x.notificationId !== notificationId
    );

    dispatch(setNotifications(updatedNotifications));
    await api.deleteNotification(notificationId);
  };
}

export function saveNotification(notification) {
  return async (dispatch, getState) => {
    const api = new NotificationsApi();
    const state = getState();

    const updatedNotifications = state.reminders.notifications.map(
      (x) => x.notification_id == notification.notificationId
    );

    dispatch(setNotifications(updatedNotifications));

    await api.updateNotification(notification);
  };
}
