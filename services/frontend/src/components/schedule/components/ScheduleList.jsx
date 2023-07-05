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

export default function ScheduleList() {
  const dispatch = useDispatch();

  const { schedules, schedulesLoading } =
    useSelector((x) => x.schedule) ?? [];

  const handleScheduleSelectOnClick = (scheduleId) => {
    dispatch(getSchedule(scheduleId));
  };

  const handleNewScheduleOnClick = () => {
    dispatch(newSchedule());
  };

  const ScheduleButton = ({ schedule }) => (
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

  const ListBoxHeader = () => (
    <ScheduleListGrid>
      <Grid item lg={6} xs={6}>
        <TitleTypography>Schedules</TitleTypography>
      </Grid>
      <Grid item lg={6} xs={6} align='right'>
        <Button onClick={handleNewScheduleOnClick}>New</Button>
      </Grid>
    </ScheduleListGrid>
  );

  useEffect(() => {
    dispatch(getSchedules());
    dispatch(getTasks());
  }, []);

  const ListBox = () => (
    <Paper elevation={3} sx={{ minHeight: '75vh' }}>
      {schedulesLoading ? (
        <Spinner id='schedule-list-spinner' />
      ) : (
        <List component='nav' id='schedule-list' sx={scrollable}>
          {schedules.map((schedule, index) => (
            <ScheduleButton key={index} schedule={schedule} />
          ))}
        </List>
      )}
    </Paper>
  );

  return (
    <div>
      <ListBoxHeader />
      <ListBox />
    </div>
  );
}
