import { Box, Typography } from '@mui/material';
import React from 'react';

const NestThermostatCardRow = ({ label, value, icon = null }) => {
  if (icon !== null && icon !== undefined) {
    return (
      <Box sx={{ marginBottom: '0.5rem' }}>
        <Typography
          sx={{
            fontSize: 14,
            verticalAlign: 'middle',
          }}
          color='text.secondary'>
          {label}
        </Typography>
        <Typography variant='body2' gutterBottom m='auto'>
          <div style={{ display: 'flex' }}>
            {icon} {value ?? ''}
          </div>
        </Typography>
      </Box>
    );
  } else {
    return (
      <>
        {' '}
        <Typography
          sx={{ fontSize: 12 }}
          color='text.secondary'
          gutterBottom>
          {label}
        </Typography>
        <Typography variant='body2' gutterBottom>
          {value ?? ''}
        </Typography>
      </>
    );
  }
};

export { NestThermostatCardRow };
