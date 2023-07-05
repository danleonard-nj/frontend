import { Grid, Paper } from '@mui/material';
import React from 'react';
import ScheduleLinkList from '../components/LinkList';
import { ScheduleHistoryPanel } from '../components/RunHistory';
import { RunQueueTable } from '../components/RunQueueTable';
import ScheduleDetail from '../components/ScheduleDetail';

const SchedulePaper = ({ children }) => (
  <Paper
    sx={{
      p: 2,
      minHeight: '8rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
    {children}
  </Paper>
);

export default function ScheduleLayout() {
  return (
    <Grid container spacing={3}>
      <Grid item lg={8} xs={12}>
        <Grid container spacing={3} id='grid-dashboard-schedule'>
          <ScheduleDetail />
          <Grid
            item
            lg={12}
            xs={12}
            id='grid-item-schedule-link-list'>
            <SchedulePaper>
              <ScheduleLinkList />
            </SchedulePaper>
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={4} xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={12} xs={12}>
            <SchedulePaper>
              <ScheduleHistoryPanel />
            </SchedulePaper>
          </Grid>

          <Grid item lg={12} xs={12}>
            <SchedulePaper>
              <RunQueueTable />
            </SchedulePaper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
