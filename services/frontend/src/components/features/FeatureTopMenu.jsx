import MenuIcon from '@mui/icons-material/Menu';
import { Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { setCreateFeatureDialog } from '../../store/features/featureSlice';

export default function FeatureTopMenu() {
  const dispatch = useDispatch();

  const handleCreateFeature = () => {
    dispatch(setCreateFeatureDialog(true));
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
