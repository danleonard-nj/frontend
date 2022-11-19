import { Grid } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import DashboardTitle from '../../dashboard/DashboardTitle';
import RunDisplayCard from './RunDisplayCard';

export default function RunHistory() {
  const schedule = useSelector((x) => x.schedule?.schedule);
  const scheduleFetching = useSelector((x) => x.schedule.scheduleFetching);
  const scheduleLoaded = useSelector((x) => x.schedule.scheduleLoaded);

  return (
    <div style={{ minHeight: '22rem' }}>
      <div style={{ height: '3rem' }}>
        <DashboardTitle>History</DashboardTitle>
      </div>

      <>
        <Grid container spacing={3} justify='center'>
          <Grid item lg={12}>
            <RunDisplayCard
              title='Last Runtime'
              runtime={schedule?.lastRuntime}
            />
          </Grid>
          <Grid item lg={12}>
            <RunDisplayCard
              title='Next Runtime'
              runtime={schedule?.nextRuntime}
            />
          </Grid>
        </Grid>
      </>
    </div>
  );
}
