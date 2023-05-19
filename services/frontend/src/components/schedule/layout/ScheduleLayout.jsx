import { Grid, Paper, styled } from '@mui/material';
import React from 'react';
import ScheduleLinkList from '../components/LinkList';
import RunHistory from '../components/RunHistory';
import RunQueueTable from '../components/RunQueueTable';
import { ScheduleDetail } from '../components/ScheduleDetail';

const StyledPaper = styled(Paper)({
  p: 2,
  display: 'flex',
});

const ScheduleLayout = () => {
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
            <StyledPaper
              sx={{
                flexDirection: 'column',
              }}>
              <ScheduleLinkList />
            </StyledPaper>
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={4} xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={12} xs={12}>
            <Paper
              sx={{
                p: 2,
              }}>
              <RunHistory />
            </Paper>
          </Grid>

          <Grid item lg={12} xs={12}>
            <Paper
              sx={{
                p: 2,
                minHeight: 240,
              }}>
              <RunQueueTable />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { ScheduleLayout };
