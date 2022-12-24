import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { dialogType, openDialog } from '../../store/dialog/dialogSlice';

export default function FeatureTopMenu() {
  const dispatch = useDispatch();

  const handleCreateFeature = () => {
    dispatch(openDialog(dialogType.createFeatureDialog));
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Button color='inherit' onClick={handleCreateFeature}>
          New Feature
        </Button>
      </Grid>
    </Grid>
  );
}
