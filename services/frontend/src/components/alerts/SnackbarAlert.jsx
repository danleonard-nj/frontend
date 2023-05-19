import { Alert, Snackbar, styled } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAlert } from '../../store/alert/alertSlice';

const Toast = styled(Alert)({
  width: '100%',
});

const SnackbarAlert = () => {
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
          <Toast
            id='alert'
            onClose={handleAlertClose}
            severity={alert.severity}>
            {alert.message}
          </Toast>
        </Snackbar>
      )}
    </>
  );
};

export { SnackbarAlert };
