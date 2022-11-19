import ScheduleIcon from '@mui/icons-material/Schedule';
import {
  Button,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../../api/helpers/formattingHelpers';
import {
  getSchedule,
  getSchedules,
} from '../../../store/schedule/scheduleActions';
import { newSchedule } from '../../../store/schedule/scheduleSlice';
import { getTasks } from '../../../store/task/taskActions';

export default function ScheduleList() {
  const dispatch = useDispatch();
  const schedules = useSelector((x) => x.schedule.schedules) ?? [];
  const schedulesLoading = useSelector((x) => x.schedule.schedulesLoading);

  console.log('render, schedules ', schedules);
  console.log('render, schedules loading ', schedulesLoading);

  const handleScheduleSelect = (scheduleId) => {
    dispatch(getSchedule(scheduleId));
  };

  const handleNewSchedule = () => {
    dispatch(newSchedule());
  };

  useEffect(() => {
    if (!schedules?.length) {
      dispatch(getSchedules());
    }

    dispatch(getTasks());
  }, []);

  return (
    <>
      <Grid
        id='schedule-list-grid'
        container
        spacing={3}
        sx={{ marginBottom: 1 }}>
        <Grid item lg={6} xs={6}>
          <Typography
            component='h2'
            variant='h6'
            color='white'
            gutterBottom
            id='schedule-title'>
            Schedules
          </Typography>
        </Grid>
        <Grid
          item
          lg={6}
          xs={6}
          align='right'
          id='schedule-new-button-container'>
          <Button onClick={handleNewSchedule} id='schedule-new-button'>
            New
          </Button>
        </Grid>
      </Grid>
      <Paper elevation={3}>
        <List component='nav' id='schedule-list' sx={scrollable}>
          {schedules.map((schedule) => (
            <ListItemButton
              onClick={() => handleScheduleSelect(schedule.scheduleId)}
              key={schedule.scheduleId}
              selected={false}>
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary={schedule.scheduleName} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </>
  );
}
