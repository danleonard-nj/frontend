import { Grid, Paper } from '@mui/material';
import React, { useRef } from 'react';
import { ScheduleList } from '../schedule/components/ScheduleList';
import ScheduleDetail from '../schedule/components/ScheduleDetail';
import { ScheduleLinkList } from '../schedule/components/LinkList';
import { ScheduleHistoryPanel } from '../schedule/components/ScheduleHistoryPanel';
import { RunQueueTable } from '../schedule/components/RunQueueTable';

const BackgroundPaper = ({ children }) => (
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

const DashboardScheduleLayout = () => {
  const detailRef = useRef(null);

  const onScheduleSelect = () => {
    if (detailRef?.current) {
      detailRef?.current?.scrollIntoView();
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={3} xs={12} md={5}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <ScheduleList onScheduleClick={onScheduleSelect} />
        </Paper>
      </Grid>
      <Grid item lg={9} xs={12} md={7}>
        <Grid container spacing={3}>
          <Grid item lg={8} xs={12}>
            <Grid container spacing={3}>
              {/* Schedule Detail / Toolbar */}
              <ScheduleDetail />
              <Grid item lg={12} xs={12}>
                <BackgroundPaper>
                  {/* Task link list */}
                  <ScheduleLinkList
                    onScheduleClick={onScheduleSelect}
                  />
                </BackgroundPaper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={4} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={12} xs={12}>
                <BackgroundPaper>
                  {/* Execution history panel */}
                  <ScheduleHistoryPanel />
                </BackgroundPaper>
              </Grid>

              <Grid item lg={12} xs={12}>
                <BackgroundPaper>
                  {/* Next 5 runs queue table */}
                  <RunQueueTable />
                </BackgroundPaper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { DashboardScheduleLayout };
