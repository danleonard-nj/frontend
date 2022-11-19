import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';
import {
  deleteSchedule,
  getSchedules,
} from '../../../store/schedule/scheduleActions';

export default function ScheduleDeleteConfirmDialog() {
  const dispatch = useDispatch();
  const schedule = useSelector((x) => x.schedule.schedule);
  const isVisible = useSelector((x) => x.dialog[dialogType.deleteSchedule]);

  function handleDelete(scheduleId) {
    dispatch(deleteSchedule(scheduleId));
    dispatch(getSchedules());
    handleClose();
  }

  function handleClose() {
    dispatch(closeDialog(dialogType.deleteSchedule));
  }

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>
        Delete {schedule.scheduleName}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Are you sure you want to delete this schedule? This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDelete(schedule.scheduleId)}>
          Delete
        </Button>
        <Button onClick={() => handleClose()} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
