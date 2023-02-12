import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { dialogType, openDialog } from '../../store/dialog/dialogSlice';
import {
  getDeviceClientResponse,
  updateDevice,
} from '../../store/kasa/actions/deviceActions';
import { setDevice } from '../../store/kasa/deviceSlice';

const DeviceCardContent = () => {
  const dispatch = useDispatch();
  const device = useSelector((x) => x.device.device);
  const regions = useSelector((x) => x.device.regions) ?? [];

  const handleDeviceNameChange = (value) => {
    dispatch(
      setDevice({
        ...device,
        alias: value,
      })
    );
  };

  const handleRegionChange = (event) => {
    dispatch(
      setDevice({
        ...device,
        region_id: event.target.value,
      })
    );
  };

  const handleSaveDevice = () => {
    dispatch(updateDevice());
  };

  const handleViewClientResponse = () => {
    dispatch(getDeviceClientResponse(device?.device_id));
    dispatch(openDialog(dialogType.kasaDeviceClientResponse));
  };

  return (
    <Grid container spacing={3} sx={{ marginTop: 1 }}>
      <Grid item lg={12} xs={12}>
        <TextField
          label='Device Name'
          value={device?.device_name ?? ''}
          variant='filled'
          fullWidth
          onChange={(event) => handleDeviceNameChange(event.target.value)}
        />
      </Grid>
      <Grid item lg={12} xs={12}>
        <TextField
          fullWidth
          label='Device ID'
          value={device?.device_id ?? ''}
          InputProps={{
            readOnly: true,
          }}
          variant='filled'
        />
      </Grid>
      <Grid item lg={12} xs={12}>
        <FormControl fullWidth>
          <InputLabel id='select-region-label'>Region</InputLabel>
          <Select
            labelId='select-region-label'
            id='select-region'
            value={device?.region_id ?? ''}
            label='Region'
            name='region'
            variant='filled'
            onChange={handleRegionChange}>
            {regions.map((region) => (
              <MenuItem value={region.region_id} key={region.region_id}>
                {region.region_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item lg={6} xs={12}>
        <TextField
          fullWidth
          label='Device Type Name'
          value={device?.device_name ?? ''}
          InputProps={{
            readOnly: true,
          }}
          variant='filled'
        />
      </Grid>

      <Grid item lg={6} xs={12}>
        <TextField
          fullWidth
          label='Device Type'
          value={device?.device_type ?? ''}
          InputProps={{
            readOnly: true,
          }}
          variant='filled'
        />
      </Grid>
      <Grid item lg={12} xs={12} align='right'>
        <Button
          variant='contained'
          onClick={handleViewClientResponse}
          sx={{ marginRight: 1 }}>
          Client Response
        </Button>
        <Button variant='contained' onClick={handleSaveDevice}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeviceCardContent;
