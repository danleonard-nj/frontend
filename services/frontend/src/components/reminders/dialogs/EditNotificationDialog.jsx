import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';
import { EditNotificationDialogLayout } from './layout/EditNotificationDialogLayout';

export const EditNotificationDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector(
    (x) => x.dialog[dialogType.editReminderNotification]
  );

  const handleClose = () => {
    dispatch(closeDialog(dialogType.editReminderNotification));
  };

  const handleSave = () => {
    dispatch(closeDialog(dialogType.editReminder));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Edit Notification</DialogTitle>
      <DialogContent>
        <EditNotificationDialogLayout />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
