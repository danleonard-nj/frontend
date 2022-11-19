import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';
import { ViewDestinationDetailsDialogLayout } from './layout/ViewDestinationDetailsDialogLayout';

export const ViewDestinationDetailsDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector(
    (x) => x.dialog[dialogType.viewReminderDestinationDetails]
  );

  const handleClose = () => {
    dispatch(closeDialog(dialogType.viewReminderDestinationDetails));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Destination Details</DialogTitle>
      <DialogContent>
        <ViewDestinationDetailsDialogLayout />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
