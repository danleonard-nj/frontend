import { Container, Snackbar } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from '../../store/features/featureSlice';
import CreateFeatureDialog from '../features/dialogs/CreateFeatureDialog';
import FeatureList from '../features/FeatureList';
import FeatureTopMenu from '../features/FeatureTopMenu';

export default function DashboardFeatureLayout() {
  const dispatch = useDispatch();
  const snackbar = useSelector((x) => x.feature.snackbar);

  const handleSnackbarClose = () => {
    dispatch(openSnackbar({ message: '', open: false }));
  };

  return (
    <>
      <FeatureTopMenu />
      <CreateFeatureDialog />
      <Container id='outer-container' sx={{ marginTop: '3rem' }} maxWidth='sm'>
        <FeatureList />
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.close}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      />
    </>
  );
}
