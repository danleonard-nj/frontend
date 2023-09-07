import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensorInfo } from '../../store/nest/nestActions';
import { setSelectedSensor } from '../../store/nest/nestSlice';
import { getWeather } from '../../store/weather/weatherActions';
import { NestSensorInfoPage } from '../nest/NestSensorInfoPage';
import { NestSideNav } from '../nest/NestSideNav';
import { NestThermostatPage } from '../nest/NestThermostatPage';
import { WeatherPage } from '../nest/weather/WeatherPage';

const NestDeviceHistoryPage = () => {
  const { sensorInfo, selectedSensor } = useSelector((x) => x.nest);

  const dispatch = useDispatch();

  const handleSetSelectedSensor = (event) => {
    console.log('handleSetSelectedSensor', event);
    dispatch(setSelectedSensor(event.target.value));
  };

  return (
    <Grid container>
      <Grid item lg={6} sm={12} xs={12}>
        <FormControl fullWidth>
          <InputLabel id='device-select-label'>Device</InputLabel>
          <Select
            labelId='device-select-label'
            id='device-select'
            value={selectedSensor}
            label='Device'
            onChange={handleSetSelectedSensor}>
            {sensorInfo?.map((device) => (
              <MenuItem value={device.device_id}>
                {device.device_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardNestLayout };
