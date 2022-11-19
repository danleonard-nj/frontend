import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../../store/dialog/dialogSlice';
import { createLocation } from '../../../../store/reminders/locationActions';
import { setLocationIsNew } from '../../../../store/reminders/reminderSlice';
import { CreateLocationDialogLayout } from './CreateLocationDialogLayout';

export const CreateReminderLocationDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((x) => x.dialog[dialogType.createReminderLocation]);

  const handleClose = () => {
    dispatch(closeDialog(dialogType.createReminderLocation));
  };

  const handleCreateLocation = () => {
    dispatch(setLocationIsNew(true));
    dispatch(createLocation());
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{ style: { overflowY: 'visible' } }}
      style={{ overflowY: 'visible' }}>
      <DialogTitle>Create Location</DialogTitle>
      <DialogContent style={{ overflowY: 'visible' }}>
        <CreateLocationDialogLayout />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreateLocation}>Create</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
