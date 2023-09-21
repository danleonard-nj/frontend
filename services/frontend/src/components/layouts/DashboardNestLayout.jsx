import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
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

const TableContainer = styled(Box)(({ theme }) => ({
  height: '75vh',
  width: '100%',
}));

const historyColumns = [
  {
    field: 'timestamp',
    headerName: 'Date',
    width: 200,
  },
  {
    field: 'degrees_fahrenheit',
    headerName: 'Degrees Fahrenheit',
    width: 200,
    valueGetter: (params) => `${params.value} F`,
  },
  {
    field: 'humidity_percent',
    headerName: 'Humidity Percent',
    width: 200,
  },
];

const integrationColumns = [
  {
    field: 'timestamp',
    headerName: 'Date',
    width: 200,
  },
  {
    field: 'device_name',
    headerName: 'Device Name',
    width: 200,
  },
  {
    field: 'event_type',
    headerName: 'Event Type',
    width: 200,
  },
  {
    field: 'result',
    headerName: 'Result',
    width: 200,
  },
];

const transformDeviceHistoryData = (data) => {
  return data.map((row) => ({
    ...row,
    id: row.record_id,
    timestamp: new Date(row.timestamp * 1000).toLocaleString(),
    humidity_percent: `${row.humidity_percent.toFixed(2)} %`,
  }));
};

const transformIntegrationEventData = (data) => {
  return data.map((row) => ({
    ...row,
    id: row.event_id,
    timestamp: new Date(row.timestamp * 1000).toLocaleString(),
  }));
};

const HistoryTable = ({ rows, columns, loading }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = transformDeviceHistoryData(rows);
    console.log('transformed data', data);
    setData(data);
  }, [rows]);

  return (
    <TableContainer>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
      />
    </TableContainer>
  );
};

const IntegrationTable = ({ rows, columns, loading }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = transformIntegrationEventData(rows);
    console.log('transformed data', data);
    setData(data);
  }, []);

  return (
    <Box sx={{ height: '75vh', width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

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

  useEffect(() => {
    if (deviceId && hoursBack && hoursBack != 0) {
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
              columns={historyColumns}
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
    if (daysBack && daysBack != 0) {
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
            value={daysBack}
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardNestLayout };
