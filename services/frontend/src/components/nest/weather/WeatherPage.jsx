import { Box, Grid, Paper, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../Spinner';
import { WeatherTable } from './WeatherTable';
import { ForecastPage } from './ForecastPage';

const WeatherPage = () => {
  const [value, setValue] = useState(0);
  const {
    weather: { weather },
    weatherLoading,
  } = useSelector((x) => x.weather);

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
        {value === 0 && <WeatherTable weather={weather} />}
        {value === 1 && <ForecastPage />}
      </Grid>
    </Grid>
  );
};

export { WeatherPage };
