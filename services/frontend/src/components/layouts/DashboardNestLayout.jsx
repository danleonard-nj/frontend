import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensorInfo } from '../../store/nest/nestActions';
import { NestSensorInfoPage } from '../nest/NestSensorInfoPage';
import { NestSideNav } from '../nest/NestSideNav';
import { NestThermostatPage } from '../nest/NestThermostatPage';
import { getWeather } from '../../store/weather/weatherActions';
import Spinner from '../Spinner';

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const getMinMax = (weather) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={12}>
        Low: {`${weather?.temperature_min ?? 'N/A'} °F`}
      </Grid>
      <Grid item lg={12}>
        High: {`${weather?.temperature_max ?? 'N/A'} °F`}
      </Grid>
    </Grid>
  );
};

const getLatLong = (weather) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={12}>
        Latitude: {`${weather?.latitude ?? 0}°`}
      </Grid>
      <Grid item lg={12}>
        Longitude: {`${weather?.longitude ?? 0}°`}
      </Grid>
    </Grid>
  );
};

const getSunriseSunset = (weather) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={12}>
        {`Sunrise: ${formatDate(weather?.sunrise ?? 0)}`}
      </Grid>
      <Grid item lg={12}>
        {`Sunset: ${formatDate(weather?.sunset ?? 0)}`}
      </Grid>
    </Grid>
  );
};

const getLocation = (weather) => {
  return `${weather.location_name}, ${weather.location_zipcode}`;
};

const getWindInfo = (weather) => {
  return `${weather?.wind_speed ?? 'N/A'}mph @ ${
    weather?.wind_degrees ?? 'N/A'
  } degrees`;
};

const WeatherPage = () => {
  const {
    weather: { weather },
    weatherLoading,
    zipCode,
  } = useSelector((x) => x.weather);

  const WeatherTable = () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Location</TableCell>
          <TableCell>{getLocation(weather)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Temperature</TableCell>
          <TableCell>{weather?.temperature ?? 'N/A'} °F</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Hi/Lo</TableCell>
          <TableCell>{getMinMax(weather)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Feels Like</TableCell>
          <TableCell>{weather.feels_like} °F</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Humidity</TableCell>
          <TableCell>{weather.humidity}%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Wind</TableCell>
          <TableCell>{getWindInfo(weather)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Pressure</TableCell>
          <TableCell>{weather.pressure}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sunrise / Sunset</TableCell>
          <TableCell>{getSunriseSunset(weather)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Lat/Long</TableCell>
          <TableCell>{getLatLong(weather)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return weatherLoading ? (
    <Spinner />
  ) : (
    <Grid container spacing={3}>
      <Grid item lg={6}>
        <WeatherTable />
      </Grid>
    </Grid>
  );
};

const DashboardNestLayout = () => {
  const dispatch = useDispatch();

  const { selectedSensor = {}, commandLoading = false } = useSelector(
    (x) => x.nest
  );

  const [sideNav, setSideNav] = useState('sensor-info');

  console.log('Selected sensor', selectedSensor);
  console.log('Side nav', sideNav);

  const handleRefreshSensorInfo = () => {
    dispatch(getSensorInfo());
  };

  const handleSideNavChange = (value) => {
    console.log('side nav change', value);
    setSideNav(value);
  };

  useEffect(() => {
    if (sideNav === 'sensor-info') {
      dispatch(getSensorInfo());
    }
    if (sideNav === 'weather') {
      dispatch(getWeather());
    }
  }, [dispatch, sideNav]);

  // const NestPageHeader = () => {
  //   return (
  //     <Grid container>
  //       <Grid item lg={10}>
  //         <Typography variant='h5' gutterBottom>
  //           Sensor Info
  //         </Typography>
  //       </Grid>
  //       <Grid item lg={2} align='right'>
  //         <Button
  //           variant='contained'
  //           onClick={handleRefreshSensorInfo}
  //           sx={{ float: 'right' }}>
  //           Refresh
  //         </Button>
  //       </Grid>
  //     </Grid>
  //   );
  // };

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {/* <Drawer
        variant='temporary'
        anchor='right'
        open={jsonSidebarOpen}
        onClose={setJsonSidebarOpen(false)}> */}

      {/* )
      </Drawer> */}
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
