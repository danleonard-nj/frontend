import ScheduleIcon from '@mui/icons-material/Schedule';
import {
  Button,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../../api/helpers/formattingHelpers';
import { defaultTask } from '../../../api/helpers/taskHelpers';
import { getTask } from '../../../store/task/taskActions';
import { setTask } from '../../../store/task/taskSlice';
import DashboardTitle from '../../dashboard/DashboardTitle';
import Spinner from '../../Spinner';

export default function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector((store) => store.task?.tasks) ?? [];
  const tasksLoading = useSelector((x) => x.task.tasksLoading);
  const task = useSelector((x) => x.task.task) ?? {};

  const handleClick = (taskId) => {
    dispatch(getTask(taskId));
  };

  const handleNewTask = () => {
    dispatch(setTask(defaultTask));
  };

  return (
    <>
      <>
        <Grid container spacing={3} sx={{ marginBottom: 1 }}>
          <Grid item lg={9}>
            <DashboardTitle>Tasks</DashboardTitle>
          </Grid>
          <Grid item lg={3}>
            <Button onClick={handleNewTask}>New</Button>
          </Grid>
        </Grid>
        {tasksLoading ? (
          <Spinner />
        ) : (
          <Paper elevation={3}>
            <List component='nav' sx={scrollable}>
              {tasks?.map((item, index) => (
                <ListItemButton
                  key={index}
                  selected={item.taskId == task.taskId}
                  onClick={() => handleClick(item.taskId)}>
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.taskName} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </>
    </>
  );
}
