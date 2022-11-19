import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { getLocalDateTimeFromString } from '../../../api/helpers/dateTimeUtils';

export default function RunDisplayCard({ title, runtime }) {
  return (
    <Card elevation={3} id='schedule-runtime-card'>
      <CardContent id='schedule-runtime-card-content'>
        <Typography
          sx={{ fontSize: 14 }}
          color='text.secondary'
          gutterBottom
          id='schedule-runtime-card-title'>
          {title}
        </Typography>
        <Typography
          variant='h5'
          component='div'
          id='schedule-runtime-card-body'>
          {getLocalDateTimeFromString(runtime)}
        </Typography>
      </CardContent>
    </Card>
  );
}
