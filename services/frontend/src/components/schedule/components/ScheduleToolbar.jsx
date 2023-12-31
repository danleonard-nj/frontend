import { Button, ButtonGroup, Grid } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../../store/dialog/dialogSlice';
import {
  runSchedule,
  saveSchedule,
} from '../../../store/schedule/scheduleActions';
import DashboardTitle from '../../dashboard/DashboardTitle';

const getFormattedScheduleName = (schedule, isModified) => {
  return isModified
    ? `${schedule.scheduleName} *`
    : schedule.scheduleName;
};

const ScheduleToolbar = () => {
  const dispatch = useDispatch();

  const { schedule = {}, isScheduleModified = false } = useSelector(
    (x) => x.schedule
  );

  const handleRunSchedule = () => {
    dispatch(runSchedule(schedule.scheduleId));
  };

  const handleSave = () => {
    dispatch(saveSchedule());
  };

  const openDeleteConfimation = () => {
    dispatch(openDialog(dialogType.deleteSchedule));
  };

  return (
    <Grid container spacing={3} sx={{ marginBottom: 1 }}>
      <Grid item lg={12} xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={4} id='schedule-title-container'>
            <DashboardTitle id='schedule-title'>
              {getFormattedScheduleName(schedule, isScheduleModified)}
            </DashboardTitle>
          </Grid>
          <Grid
            item
            lg={6}
            xs={8}
            id='schedule-save-delete-button-group-container'>
            <ButtonGroup
              fullWidth
              variant='text'
              id='schedule-save-delete-button-group'>
              <Button
                onClick={handleSave}
                color='success'
                id='schedule-save-button'>
                Save
              </Button>
              <Button
                id='schedule-trigger-button'
                color='info'
                onClick={handleRunSchedule}>
                Trigger
              </Button>
              <Button
                id='schedule-delete-button'
                color='error'
                onClick={openDeleteConfimation}>
                Delete
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { ScheduleToolbar };
