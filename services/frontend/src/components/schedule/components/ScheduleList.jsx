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
  styled,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSchedule,
  getSchedules,
} from '../../../store/schedule/scheduleActions';
import { newSchedule } from '../../../store/schedule/scheduleSlice';
import { getTasks } from '../../../store/task/taskActions';
import Spinner from '../../Spinner';

const ScheduleListStyledGrid = styled(Grid)({
  marginBottom: 1,
});

const ScheduleListStyledPaper = styled(Paper)({
  minHeight: '75vh',
});

const ScrollableList = styled(List)({
  maxHeight: '75vh',
  overflow: 'auto',
});

const ScheduleList = () => {
  const dispatch = useDispatch();

  const { schedules, schedulesLoading } = useSelector(
    (x) => x.schedule
  );

  const handleScheduleSelect = (scheduleId) => {
    dispatch(getSchedule(scheduleId));
  };

  const handleNewSchedule = () => {
    dispatch(newSchedule());
  };

  useEffect(() => {
    dispatch(getSchedules());
    dispatch(getTasks());
  }, []);

  return (
    <>
      <ScheduleListStyledGrid
        id='schedule-list-grid'
        container
        spacing={3}>
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
          <Button
            onClick={handleNewSchedule}
            id='schedule-new-button'>
            New
          </Button>
        </Grid>
      </ScheduleListStyledGrid>
      <ScheduleListStyledPaper elevation={3}>
        {schedulesLoading ? (
          <Spinner id='schedule-list-spinner' />
        ) : (
          <ScrollableList component='nav' id='schedule-list'>
            {schedules.map((schedule) => (
              <ListItemButton
                onClick={() =>
                  handleScheduleSelect(schedule.scheduleId)
                }
                key={schedule.scheduleId}
                selected={false}>
                <ListItemIcon>
                  <ScheduleIcon />
                </ListItemIcon>
                <ListItemText primary={schedule.scheduleName} />
              </ListItemButton>
            ))}
          </ScrollableList>
        )}
      </ScheduleListStyledPaper>
    </>
  );
};

export { ScheduleList };
