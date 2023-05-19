import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';

const FeatureTopMenu = () => {
  const dispatch = useDispatch();

  const handleCreateFeature = () => {
    dispatch(openDialog(dialogType.createFeatureDialog));
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Grid container direction='row' justifyContent='end'>
          <Button
            color='primary'
            variant='contained'
            onClick={handleCreateFeature}>
            New Feature
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { FeatureTopMenu };
