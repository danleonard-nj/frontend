import {
  ButtonGroup,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import { getFeatures } from '../../store/features/featureActions';
import { featureType } from '../../api/helpers/featureHelpers';
import ClearIcon from '@mui/icons-material/Clear';

const FeatureTopMenu = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  const dispatch = useDispatch();

  const handleCreateFeature = () => {
    dispatch(openDialog(dialogType.createFeatureDialog));
  };

  const handleRefresh = () => {
    dispatch(getFeatures());
  };

  const handleClear = () => {
    onSearchChange('');
    onTypeFilterChange('');
  };

  return (
    <Grid container spacing={2} sx={{ mb: 2 }} alignItems='center'>
      <Grid item xs={12} md={4} lg={4}>
        <TextField
          label='Search name or key'
          value={searchTerm}
          fullWidth
          size='small'
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={6} md={3} lg={2}>
        <FormControl fullWidth size='small'>
          <InputLabel id='feature-type-filter-label'>Type</InputLabel>
          <Select
            labelId='feature-type-filter-label'
            label='Type'
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}>
            <MenuItem value=''>All</MenuItem>
            {Object.keys(featureType).map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} md={2} lg={2}>
        <Tooltip title='Clear filters'>
          <IconButton onClick={handleClear} size='small'>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={12} md={3} lg={4}>
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
