import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getIntegrationEvents,
  getSensorHistory,
  getSensorInfo,
} from '../../store/nest/nestActions';
import { getWeather } from '../../store/weather/weatherActions';
import Spinner from '../Spinner';
import { NestSensorInfoPage } from '../nest/NestSensorInfoPage';
import { NestSideNav } from '../nest/NestSideNav';
import { NestThermostatPage } from '../nest/NestThermostatPage';
import { WeatherPage } from '../nest/weather/WeatherPage';

const NestDeviceHistoryPage = () => {
  const [hoursBack, setHoursBack] = useState(1);
  const [deviceId, setDeviceId] = useState('');

  const { sensorInfo } = useSelector((x) => x.nest);

  const dispatch = useDispatch();

  const handleSetDaysBack = (event) => {
    setHoursBack(event.target.value ?? 1);
  };

  useEffect(() => {
    if (deviceId) {
      dispatch(getSensorHistory(deviceId, hoursBack));
    }
  }, [deviceId, hoursBack]);

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
              value={deviceId ?? ''}
              label='Device'
              onChange={(e) => setDeviceId(e.target.value)}
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
            label='Hours Back'
            value={hoursBack}
            onChange={handleSetDaysBack}
          />
        </span>
      </Grid>
    </Grid>
  );
};

const NestIntegrationPage = () => {
  const [daysBack, setDaysBack] = useState(7);

  const { events, eventsLoading } = useSelector((x) => x.nest);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIntegrationEvents(daysBack));
  }, [daysBack]);

  return (
    <Grid container>
      <Grid item lg={12} sm={12} xs={12}>
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
          <TextField
            type='number'
            label='Days Back'
            value={daysBack}
            onChange={(e) => setDaysBack(e.target.value)}
          />
        </span>
      </Grid>
      <Grid item lg={12} sm={12} xs={12}>
        {eventsLoading ? (
          <Spinner />
        ) : (
          <Table dense>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Device Name</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow hover key={event.event_id}>
                  <TableCell>
                    {new Date(
                      event.timestamp * 1000
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell>{event.device_name}</TableCell>
                  <TableCell>{event.event_type}</TableCell>
                  <TableCell>{event.result}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
              {sideNav === 'integrations' && <NestIntegrationPage />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardNestLayout };
