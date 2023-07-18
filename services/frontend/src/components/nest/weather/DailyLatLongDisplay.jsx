import { Grid } from '@mui/material';
import React from 'react';

const DailyLatLongDisplay = ({ weather }) => {
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

export { DailyLatLongDisplay };
