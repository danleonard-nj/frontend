import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';
import {
  createReminder,
  saveReminder,
} from '../../../store/reminders/reminderActions';
import { setNewReminder } from '../../../store/reminders/reminderSlice';
import { EditReminderDialogLayout } from './layout/EditReminderDialogLayout';

export const EditReminderDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((x) => x.dialog[dialogType.editReminder]);
  const isNew = useSelector((x) => x.reminders.isNew);

  const handleClose = () => {
    dispatch(closeDialog(dialogType.editReminder));
  };

  const handleSave = () => {
    if (isNew) {
      dispatch(createReminder());
      dispatch(setNewReminder(false));
    } else {
      dispatch(saveReminder());
    }

    dispatch(closeDialog(dialogType.editReminder));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth>
      <DialogTitle>Create Reminder</DialogTitle>
      <DialogContent>
        <EditReminderDialogLayout />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
