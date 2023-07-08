import { Box, Grid, Paper } from '@mui/material';
import React, { useRef } from 'react';
import { ScheduleLinkList } from '../components/LinkList';
import { ScheduleHistoryPanel } from '../components/RunHistory';
import { RunQueueTable } from '../components/RunQueueTable';
import ScheduleDetail from '../components/ScheduleDetail';
import { ScheduleList } from '../components/ScheduleList';

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

export default function ScheduleLayout() {
  const detailRef = useRef(null);

  const onScheduleSelect = () => {
    console.log('ref select!');
    console.log(detailRef);
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
}
