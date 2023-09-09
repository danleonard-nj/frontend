import { Button, Grid } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../../store/dialog/dialogSlice';
import DashboardTitle from '../../dashboard/DashboardTitle';
import { RunDisplayCard } from './RunDisplayCard';

const getDisplayTime = (timestamp) => {
  const displayDate = new Date(timestamp * 1000).toLocaleString();
  return displayDate;
};

const ScheduleHistoryPanel = () => {
  const dispatch = useDispatch();

  const { schedule = {} } = useSelector((x) => x.schedule);

  const handleOpenViewDialog = () => {
    dispatch(openDialog(dialogType.scheduleHistoryViewDialog));
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} sm={12} xs={12}>
        <Grid
          container
          direction='row'
          justifyContent='space-between'>
          <DashboardTitle>History</DashboardTitle>
          <Button onClick={handleOpenViewDialog}>View</Button>
        </Grid>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={3} justify='center'>
          <Grid item lg={12}>
            <RunDisplayCard
              title='Last Runtime'
              runtime={getDisplayTime(schedule?.lastRuntime ?? 0)}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={3} justify='center'>
          <Grid item lg={12}>
            <RunDisplayCard
              title='Next Runtime'
              runtime={getDisplayTime(schedule?.nextRuntime ?? 0)}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { ScheduleHistoryPanel };
