import { ButtonGroup, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import { getFeatures } from '../../store/features/featureActions';

const FeatureTopMenu = () => {
  const dispatch = useDispatch();

  const handleCreateFeature = () => {
    dispatch(openDialog(dialogType.createFeatureDialog));
  };

  const handleRefresh = () => {
    dispatch(getFeatures());
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Grid container direction='row' justifyContent='end'>
          <ButtonGroup variant='outlined'>
            <Button color='primary' onClick={handleCreateFeature}>
              New Feature
            </Button>
            <Button color='primary' onClick={handleRefresh}>
              Refresh
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { FeatureTopMenu };
