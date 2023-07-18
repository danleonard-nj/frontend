import { Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSensorInfo } from '../../store/nest/nestActions';
import { getWeather } from '../../store/weather/weatherActions';
import { NestSensorInfoPage } from '../nest/NestSensorInfoPage';
import { NestSideNav } from '../nest/NestSideNav';
import { NestThermostatPage } from '../nest/NestThermostatPage';
import { WeatherPage } from '../nest/weather/WeatherPage';

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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardNestLayout };
