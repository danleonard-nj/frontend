import { Container } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import FeatureList from '../features/FeatureList';
import FeatureTopMenu from '../features/FeatureTopMenu';

export default function DashboardFeatureLayout() {
  const dispatch = useDispatch();
  // const snackbar = useSelector((x) => x.feature.snackbar);

  // const handleSnackbarClose = () => {
  //   dispatch(openSnackbar({ message: '', open: false }));
  // };

  return (
    <>
      <FeatureTopMenu />
      <Container id='outer-container' sx={{ marginTop: '3rem' }} maxWidth='sm'>
        <FeatureList />
      </Container>

      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.close}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      /> */}
    </>
  );
}
