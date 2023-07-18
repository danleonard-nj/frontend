import { Grid } from '@mui/material';
import React from 'react';

const DailyMinMaxDisplay = ({ weather }) => {
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

export { DailyMinMaxDisplay };
