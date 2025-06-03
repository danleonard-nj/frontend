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
import {
  newSchedule,
  setIsScheduleModified,
} from '../../../store/schedule/scheduleSlice';
import { getTasks } from '../../../store/task/taskActions';
import Spinner from '../../Spinner';

const TitleTypography = ({ children }) => (
  <Typography
    component='h2'
    variant='h6'
    color='white'
    gutterBottom
    id='schedule-title'>
    {children}
  </Typography>
);

const ScheduleListGrid = ({ children }) => (
  <Grid
    id='schedule-list-grid'
    container
    spacing={3}
    sx={{ marginBottom: 1 }}>
    {children}
  </Grid>
);

const ListBoxHeader = ({ handleNewScheduleOnClick }) => (
  <ScheduleListGrid>
    <Grid item lg={6} xs={6}>
      <TitleTypography>Schedules</TitleTypography>
    </Grid>
    <Grid item lg={6} xs={6} align='right'>
      <Button onClick={handleNewScheduleOnClick}>New</Button>
    </Grid>
  </ScheduleListGrid>
);

const ScheduleButton = ({
  schedule,
  handleScheduleSelectOnClick,
}) => (
  <ListItemButton
    onClick={() => handleScheduleSelectOnClick(schedule.scheduleId)}
    key={schedule.scheduleId}
    selected={false}>
    <ListItemIcon>
      <ScheduleIcon />
    </ListItemIcon>
    <ListItemText primary={schedule.scheduleName} />
  </ListItemButton>
);

const ScheduleList = ({ onScheduleClick }) => {
  const dispatch = useDispatch();

  const {
    schedules,
    schedulesLoading,
    isScheduleModified = false,
  } = useSelector((x) => x.schedule) ?? [];

  const handleScheduleSelectOnClick = (scheduleId) => {
    dispatch(getSchedule(scheduleId));
    onScheduleClick();

    // Clear the modified flag
    if (isScheduleModified) {
      dispatch(setIsScheduleModified(false));
    }
  };

  const handleNewScheduleOnClick = () => {
    dispatch(newSchedule());
  };

  useEffect(() => {
    dispatch(getSchedules());
    dispatch(getTasks());
  }, []);

  return (
    <div>
      <ListBoxHeader
        handleNewScheduleOnClick={handleNewScheduleOnClick}
      />
      <Paper elevation={3} sx={{ minHeight: '75vh' }}>
        {schedulesLoading ? (
          <Spinner id='schedule-list-spinner' />
        ) : (
          <List component='nav' id='schedule-list' sx={scrollable}>
            {schedules.map((schedule, index) => (
              <ScheduleButton
                key={index}
                schedule={schedule}
                handleScheduleSelectOnClick={
                  handleScheduleSelectOnClick
                }
              />
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
};

export { ScheduleList };
