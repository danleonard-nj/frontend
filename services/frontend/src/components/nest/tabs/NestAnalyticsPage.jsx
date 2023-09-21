import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalyticsData } from '../../../store/nest/nestActions';

const NestAnalyticsPage = () => {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [sample, setSample] = useState('5min');
  const [hoursBack, setHoursBack] = useState(1);

  console.log('devices', selectedDevices);

  const {
    analytics,
    analyticsLoading,
    sensorInfo = [],
  } = useSelector((x) => x.nest);

  const dispatch = useDispatch();

  const handleDeviceSelectChange = (event) => {
    console.log('handle device select change', event.target.value);
    setSelectedDevices(
      typeof value === 'string'
        ? event.target.value.split(',')
        : event.target.value
    );
  };

  const handleSampleChange = (event) => {
    setSample(event.target.value);
  };

  const isReadyToLoad = () => {
    return (
      selectedDevices.length > 0 &&
      hoursBack &&
      hoursBack != 0 &&
      sample
    );
  };

  const handleHoursBackChange = (event) => {
    setHoursBack(event.target.value);
  };

  useEffect(() => {
    if (isReadyToLoad()) {
      dispatch(getAnalyticsData(hoursBack, sample, selectedDevices));
    }
  }, [hoursBack, sample, selectedDevices]);

  const SampleSelect = () => {
    return (
      <FormControl fullWidth>
        <InputLabel id='sample-select-label'>Sample</InputLabel>
        <Select
          labelId='sample-select-label'
          id='sample-select'
          value={sample}
          label='Sample'
          onChange={handleSampleChange}>
          <MenuItem value='1min'>1min</MenuItem>
          <MenuItem value='5min'>5min</MenuItem>
          <MenuItem value='1h'>1h</MenuItem>
          <MenuItem value='4h'>4h</MenuItem>
          <MenuItem value='12h'>12h</MenuItem>
          <MenuItem value='1d'>1d</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const DeviceSelect = ({ devices }) => {
    return (
      <FormControl fullWidth>
        <InputLabel id='sample-select-label'>Devices</InputLabel>
        <Select
          labelId='sample-select-label'
          id='sample-select'
          value={selectedDevices}
          label='Sample'
          onChange={handleDeviceSelectChange}
          multiple>
          {devices.map((device) => (
            <MenuItem key={device.device_id} value={device.device_id}>
              {device.device_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const HoursBackTextField = () => {
    return (
      <TextField
        label='Hours Back'
        value={hoursBack}
        onChange={handleHoursBackChange}
        type='number'
      />
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} sm={12} xs={12}>
        <Typography variant='h5'>Analytics</Typography>
      </Grid>
      <Grid item lg={12} sm={12} xs={12}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
          }}>
          <HoursBackTextField />
          <SampleSelect />
          <DeviceSelect devices={sensorInfo} />
        </span>
      </Grid>
    </Grid>
  );
};

export { NestAnalyticsPage };
