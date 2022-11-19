import RemindersApi from '../../api/reminders/remindersApi';
import {
  setCronDescriptor,
  setReminder,
  setReminders,
  setTimezones,
} from './reminderSlice';

export function getReminders() {
  return async (dispatch, getState) => {
    const api = new RemindersApi();

    const reminders = await api.getReminders();
    dispatch(setReminders(reminders));
  };
}

export function getReminder(reminderId, reminderType) {
  return async (dispatch, getState) => {
    const api = new RemindersApi();

    if (reminderType == 'Generic') {
      const generic = await api.getGenricReminder(reminderId);
      dispatch(setReminder(generic));
    }

    if (reminderType == 'Destination') {
      const destination = await api.getDestinationReminder(reminderId);
      dispatch(setReminder(destination));
    }
  };
}

export function saveReminder() {
  return async (dispatch, getState) => {
    const api = new RemindersApi();
    const state = getState();

    if (state.reminders.reminder.reminderType == 'Generic') {
      await api.updateGenericReminder(state.reminders.reminder);
    }

    if (state.reminders.reminder.reminderType == 'Destination') {
      await api.updateDestinationReminder(state.reminders.reminder);
    }

    const reminders = await api.getReminders();
    dispatch(setReminders(reminders));
  };
}

export function createReminder() {
  return async (dispatch, getState) => {
    const api = new RemindersApi();
    const state = getState();

    const reminder = state.reminders.reminder;

    if (reminder.reminderType == 'Destination') {
      await api.createDestinationReminder(reminder);
    }

    if (reminder.reminderType == 'Generic') {
      await api.createGenericReminder(reminder);
    }

    const updatedReminders = await api.getReminders();
    dispatch(setReminders(updatedReminders));
  };
}

export function setSelectedReminder(reminderId) {
  return async (dispatch, getState) => {
    const state = getState();

    const reminder = state.reminders.reminders.find(
      (x) => x.reminderId == reminderId
    );
    dispatch(setReminder(reminder));
  };
}

export function getTimezones() {
  return async (dispatch, getState) => {
    const api = new RemindersApi();

    const timezones = await api.getTimezones();
    dispatch(setTimezones(timezones));
  };
}

export function deleteReminder(reminderId, reminderType) {
  return async (dispatch, getState) => {
    const api = new RemindersApi();

    if (reminderType == 'Generic') {
      await api.deleteGenericReminder(reminderId);
    }

    if (reminderType == 'Destination') {
      await api.deleteDestinationReminder(reminderId);
    }

    const reminders = await api.getReminders();
    dispatch(setReminders(reminders));
  };
}

export function getCronDescriptor(cron) {
  return async (dispatch, getState) => {
    const api = new RemindersApi();

    const descriptor = await api.getCronDescriptor(cron);
    dispatch(setCronDescriptor(descriptor));
  };
}
