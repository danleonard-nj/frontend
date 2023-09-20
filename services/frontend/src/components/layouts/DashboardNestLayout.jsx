import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSensorHistory,
  getSensorInfo,
} from '../../store/nest/nestActions';
import { getWeather } from '../../store/weather/weatherActions';
import { NestSensorInfoPage } from '../nest/NestSensorInfoPage';
import { NestSideNav } from '../nest/NestSideNav';
import { NestThermostatPage } from '../nest/NestThermostatPage';
import { WeatherPage } from '../nest/weather/WeatherPage';

const NestDeviceHistoryPage = () => {
  const [daysBack, setDaysBack] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState({});

  const { sensorInfo } = useSelector((x) => x.nest);

  const dispatch = useDispatch();

  const handleSetSelectedSensor = (event) => {
    const device = sensorInfo.find(
      (x) => x.device_id === event.target.value
    );

    setSelectedDevice(device);
  };

  const handleSetDaysBack = (event) => {
    setDaysBack(event.target.value ?? 1);
  };

  useEffect(() => {
    if (selectedDevice?.device_id) {
      dispatch(getSensorHistory(selectedDevice.device_id, daysBack));
    }
  }, [selectedDevice]);

  return (
    <Grid container>
      <Grid item lg={12} sm={12} xs={12}>
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <FormControl>
            <InputLabel id='device-select-label'>Device</InputLabel>
            <Select
              labelId='device-select-label'
              displayEmpty
              id='device-select'
              defaultValue='hello world'
              value={selectedDevice?.device_id ?? ''}
              label='Device'
              onChange={handleSetSelectedSensor}
              sx={{ minWidth: '250px' }}>
              {sensorInfo?.map((device) => (
                <MenuItem
                  key={device.device_id}
                  value={device.device_id}>
                  {device.device_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type='number'
            label='Days'
            value={daysBack}
            onChange={handleSetDaysBack}
          />
        </span>
      </Grid>
    </Grid>
  );
};

const NestIntegrationPage = () => {};

const DashboardNestLayout = () => {
  const dispatch = useDispatch();

  const [sideNav, setSideNav] = useState('sensor-info');

  useEffect(() => {
    if (sideNav === 'sensor-info') {
      dispatch(getSensorInfo());
    }
    if (sideNav === 'weather') {
      dispatch(getWeather());
    }
  }, [dispatch, sideNav]);

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={12} sm={12}>
          <NestSideNav selected={sideNav} onChange={setSideNav} />
        </Grid>
        <Grid item lg={9}>
          <Grid container spacing={2}>
            <Grid item lg={12}>
              {sideNav === 'sensor-info' && <NestSensorInfoPage />}
              {sideNav === 'thermostat' && <NestThermostatPage />}
              {sideNav === 'weather' && <WeatherPage />}
              {sideNav === 'device-history' && (
                <NestDeviceHistoryPage />
              )}
              {sideNav === 'integrations' && <></>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardNestLayout };
