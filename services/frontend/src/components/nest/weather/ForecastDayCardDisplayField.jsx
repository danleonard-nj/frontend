import { Typography } from '@mui/material';
import React from 'react';

const ForecastDayCardDisplayField = ({ label, value }) => {
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

export { ForecastDayCardDisplayField };
