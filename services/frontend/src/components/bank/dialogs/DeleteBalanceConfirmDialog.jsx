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
import {
  closeDialog,
  dialogType,
} from '../../../store/dialog/dialogSlice';
import { deleteBalance } from '../../../store/bank/bankActions';
import { formatCurrency } from '../../../api/helpers/bankHelpers';

const DeleteBalanceConfirmDialog = () => {
  const dispatch = useDispatch();
  const selectedBalance = useSelector((x) => x.bank.selectedBalance);
  const isVisible = useSelector(
    (x) => x.dialog[dialogType.deleteBalance]
  );

  const handleDelete = () => {
    if (selectedBalance) {
      dispatch(deleteBalance(selectedBalance.balance_id));
      handleClose();
    }
  };

  const handleClose = () => {
    dispatch(closeDialog(dialogType.deleteBalance));
  };

  if (!selectedBalance) return null;

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>
        Delete Balance Record?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Are you sure you want to delete this balance record?
          <br />
          <br />
          <strong>Bank:</strong> {selectedBalance.bank_key}
          <br />
          <strong>Balance:</strong>{' '}
          {formatCurrency(selectedBalance.balance ?? 0)}
          <br />
          <strong>Date:</strong>{' '}
          {selectedBalance.timestamp &&
            new Date(
              selectedBalance.timestamp * 1000
            ).toLocaleString()}
          <br />
          <br />
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color='error'>
          Delete
        </Button>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { DeleteBalanceConfirmDialog };
