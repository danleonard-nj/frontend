import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  historyColumns,
  integrationColumns,
} from '../../api/data/nest/tables';
import {
  getIntegrationEvents,
  getSensorHistory,
  getSensorInfo,
} from '../../store/nest/nestActions';
import { getWeather } from '../../store/weather/weatherActions';
import { NestSensorInfoPage } from '../nest/NestSensorInfoPage';
import { NestSideNav } from '../nest/NestSideNav';
import { NestThermostatPage } from '../nest/NestThermostatPage';
import { HistoryTable } from '../nest/tables/HistoryTable';
import { IntegrationTable } from '../nest/tables/IntegrationTable';
import { NestAnalyticsPage } from '../nest/tabs/NestAnalyticsPage';
import { WeatherPage } from '../nest/weather/WeatherPage';
import { setSelectedDeviceLogId } from '../../store/nest/nestSlice';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';

const NestDeviceHistoryPage = () => {
  const [hoursBack, setHoursBack] = useState(1);
  const [deviceId, setDeviceId] = useState('');

  const {
    sensorInfo = {},
    sensorHistory = [],
    sensorHistoryLoading = false,
  } = useSelector((x) => x.nest);

  const dispatch = useDispatch();

  const handleSetDaysBack = (event) => {
    setHoursBack(event.target.value ?? 1);
  };

  const handleRefresh = () => {
    dispatch(getSensorHistory(deviceId, hoursBack));
  };

  const handleViewDiagnosticInfo = (e, logId) => {
    dispatch(setSelectedDeviceLogId(logId));
    dispatch(openDialog(dialogType.viewNestDeviceLogRecord));
    e.preventDefault();
    e.stopPropagation();
  };

  // Define the view column for the hsiotry table here as
  // we need to dispatch an action when the button is clicked
  // using the device ID
  const columns = [
    ...historyColumns,
    {
      field: 'view',
      headerName: 'View',
      width: 200,
      renderCell: (params) => {
        return (
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={(e) => handleViewDiagnosticInfo(e, params)}>
            View
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (deviceId && hoursBack !== 0) {
      dispatch(getSensorHistory(deviceId, hoursBack));
    }
  }, [deviceId, hoursBack]);

  return (
    <Grid container>
      <Grid item lg={12} sm={12} xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={12} sm={12} xs={12}>
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <FormControl>
                <InputLabel id='device-select-label'>
                  Device
                </InputLabel>
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
          <Grid item lg={12} sm={12} xs={12}>
            <HistoryTable
              rows={sensorHistory}
              columns={columns}
              loading={sensorHistoryLoading}
            />
          </Grid>
          <Grid item lg={12} sm={12} xs={12} align='right'>
            <Button onClick={handleRefresh}>Refresh</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const NestIntegrationPage = () => {
  const [daysBack, setDaysBack] = useState(7);

  const { events, eventsLoading } = useSelector((x) => x.nest);

  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(getIntegrationEvents(daysBack));
  };

  useEffect(() => {
    if (daysBack && daysBack !== 0) {
      dispatch(getIntegrationEvents(daysBack));
    }
  }, [daysBack]);

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} sm={12} xs={12}>
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Typography variant='h5'>Integration Events</Typography>
          <TextField
            type='number'
            label='Days Back'
            value={daysBack ?? 0}
            onChange={(e) => setDaysBack(e.target.value)}
          />
        </span>
      </Grid>
      <Grid item lg={12} sm={12} xs={12}>
        <IntegrationTable
          rows={events}
          columns={integrationColumns}
          loading={eventsLoading}
        />
      </Grid>
      <Grid item lg={12} sm={12} xs={12} align='right'>
        <Button onClick={handleRefresh}>Refresh</Button>
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
              {sideNav === 'analytics' && <NestAnalyticsPage />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardNestLayout };
