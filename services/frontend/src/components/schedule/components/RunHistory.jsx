import { Grid } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import DashboardTitle from '../../dashboard/DashboardTitle';
import RunDisplayCard from './RunDisplayCard';

const getDisplayTime = (timestamp) => {
  console.log('Timestamp to convert: ', timestamp);
  const displayDate = new Date(timestamp * 1000).toLocaleString();
  console.log('Display date: ', displayDate);
  return displayDate;
};

export default function RunHistory() {
  const schedule = useSelector((x) => x.schedule?.schedule);

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
              runtime={getDisplayTime(schedule?.lastRuntime ?? 0)}
            />
          </Grid>
          <Grid item lg={12}>
            <RunDisplayCard
              title='Next Runtime'
              runtime={getDisplayTime(schedule?.nextRuntime ?? 0)}
            />
          </Grid>
        </Grid>
      </>
    </div>
  );
}
