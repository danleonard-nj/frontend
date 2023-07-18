import { Grid } from '@mui/material';
import React from 'react';

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const DailySunriseSunsetDisplay = ({ weather }) => {
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

export { DailySunriseSunsetDisplay };
