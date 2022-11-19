import { Typography } from '@mui/material';
import * as React from 'react';

const ServiceTitle = ({ title }) => {
  return (
    <Typography gutterBottom={false} variant='h5'>
      {title}
    </Typography>
  );
};

export { ServiceTitle };
