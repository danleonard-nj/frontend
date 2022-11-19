import { Typography } from '@mui/material';
import * as React from 'react';

const ChartTitle = ({ title }) => {
  return (
    <Typography gutterBottom={false} variant='button'>
      {title}
    </Typography>
  );
};

export { ChartTitle };
