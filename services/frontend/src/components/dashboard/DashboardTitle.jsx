import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

export default function DashboardTitle({ children }) {
  return (
    <Typography component='h2' variant='h6' color='white'>
      {children}
    </Typography>
  );
}

DashboardTitle.propTypes = {
  children: PropTypes.any,
};
