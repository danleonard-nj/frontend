import { Grid, Paper } from '@mui/material';
import React from 'react';
import ScheduleList from '../schedule/components/ScheduleList';
import ScheduleLayout from '../schedule/layout/ScheduleLayout';

export default function DashboardScheduleLayout() {
  return (
    <Grid container spacing={3}>
      <Grid item lg={3} xs={12} md={5}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <ScheduleList />
        </Paper>
      </Grid>
      <Grid item lg={9} xs={12} md={7}>
        <ScheduleLayout />
      </Grid>
    </Grid>
  );
}
