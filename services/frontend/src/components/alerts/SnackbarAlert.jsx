import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAlert } from '../../store/alert/alertSlice';

export default function SnackbarAlert() {
  const dispatch = useDispatch();
  const alert = useSelector((store) => store.alert);

  function handleAlertClose() {
    dispatch(closeAlert());
  }

  return (
    <>
      {alert.isOpen && (
        <Snackbar
          id='alert-snackbar'
          open={alert.isOpen}
          autoHideDuration={6000}
          onClose={handleAlertClose}>
          <Alert
            id='alert'
            onClose={handleAlertClose}
            severity={alert.severity}
            sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
