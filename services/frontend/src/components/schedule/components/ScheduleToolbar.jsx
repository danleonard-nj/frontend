import { Button, ButtonGroup, Grid } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dialogType, openDialog } from '../../../store/dialog/dialogSlice';
import {
  runSchedule,
  saveSchedule,
} from '../../../store/schedule/scheduleActions';
import DashboardTitle from '../../dashboard/DashboardTitle';

export default function ScheduleToolbar() {
  const dispatch = useDispatch();
  const schedule = useSelector((store) => store.schedule?.schedule);
  const scheduleLoading = useSelector((x) => x.schedule.scheduleLoading);

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
              {schedule.scheduleName ?? ''}
            </DashboardTitle>
          </Grid>
          <Grid
            item
            lg={6}
            xs={8}
            // align='right'
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
}
