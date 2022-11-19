import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteTask, getTasks } from '../../../store/task/taskActions';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';

export default function DeleteTaskConfirmationDialog() {
  const dispatch = useDispatch();
  const task = useSelector((x) => x.task.task);
  const isVisible = useSelector((x) => x.dialog[dialogType.deleteTask]);

  function handleClose() {
    dispatch(closeDialog(dialogType.deleteTask));
  }

  function handleDelete() {
    dispatch(deleteTask(task.taskId));
    handleClose();
  }

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>Delete {task.taskName}?</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Are you sure you want to delete this task? This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDelete()}>Delete</Button>
        <Button onClick={() => handleClose()} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteTaskConfirmationDialog.propTypes = {
  visibilityState: PropTypes.bool,
};
