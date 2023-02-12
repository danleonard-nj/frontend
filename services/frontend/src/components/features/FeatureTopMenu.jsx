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
    <Grid container direction='row' justifyContent='end'>
      <Button color='primary' variant='contained' onClick={handleCreateFeature}>
        New Feature
      </Button>
    </Grid>
  );
}
