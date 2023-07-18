import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensorInfo } from '../../store/nest/nestActions';
import { NestSensorInfoPage } from '../nest/NestSensorInfoPage';
import { NestSideNav } from '../nest/NestSideNav';
import { NestThermostatPage } from '../nest/NestThermostatPage';
import {
  getForecast,
  getWeather,
} from '../../store/weather/weatherActions';
import Spinner from '../Spinner';
import {
  formatForecastDay,
  getFormattedFahrenheit,
  getFormattedPercent,
  getLocation,
  getWindInfo,
} from '../../api/helpers/nestHelpers';

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const DailyMinMaxDisplay = (weather) => {
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

const DailyLatLongDisplay = (weather) => {
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

const DailySunriseSunsetDisplay = (weather) => {
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

const FieldData = ({ label, value }) => {
  return (
    <>
      <Typography sx={{ fontSize: 14 }} color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='body2' gutterBottom>
        {value}
      </Typography>
    </>
  );
};

const ForecastDayCard = ({ forecast }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' align='center' gutterBottom>
          {formatForecastDay(forecast?.date)}
        </Typography>
        <FieldData
          label='High'
          value={getFormattedFahrenheit(forecast?.temperature_max)}
        />
        <FieldData
          label='Low'
          value={getFormattedFahrenheit(forecast?.temperature_min)}
        />
        <FieldData
          label='Humidity'
          value={getFormattedPercent(forecast?.humidity)}
        />
        <FieldData
          label='Feels Like'
          value={getFormattedFahrenheit(forecast?.feels_like)}
        />
      </CardContent>
    </Card>
  );
};

const ForecastPage = () => {
  const { forecast, forecastLoading } = useSelector((x) => x.weather);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getForecast());
  }, []);

  const ForecastPageContent = () => {
    return (
      <Grid container spacing={3}>
        {forecast?.map((day) => (
          <Grid item lg={3}>
            <ForecastDayCard forecast={day} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return forecastLoading ? <Spinner /> : <ForecastPageContent />;
};

const WeatherPage = () => {
  const [value, setValue] = useState(0);
  const {
    weather: { weather },
    weatherLoading,
  } = useSelector((x) => x.weather);

  const WeatherTable = () => (
    <Grid container spacing={3}>
      <Grid item lg={6}>
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
              <TableCell>
                {weather?.temperature ?? 'N/A'} °F
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hi/Lo</TableCell>
              <TableCell>{DailyMinMaxDisplay(weather)}</TableCell>
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
              <TableCell>
                {DailySunriseSunsetDisplay(weather)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lat/Long</TableCell>
              <TableCell>{DailyLatLongDisplay(weather)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return weatherLoading ? (
    <Spinner />
  ) : (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label='Today' />
              <Tab label='Forecast' />
            </Tabs>
          </Box>
        </Box>
      </Grid>
      <Grid item lg={12}>
        <>
          {value === 0 && <WeatherTable />}
          {value === 1 && <ForecastPage />}
        </>
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
