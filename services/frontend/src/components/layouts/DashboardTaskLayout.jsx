import { Grid, Paper } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getClients, getTasks } from '../../store/task/taskActions';
import TaskList from '../task/components/TaskList';
import { TaskLayout } from '../task/layouts/TaskLayout';

export default function DashboardTaskLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTasks());
    dispatch(getClients());
  });

  return (
    <>
      <Grid container spacing={3} id='task-container'>
        <Grid item lg={3} xs={12} md={5} id='task-list-container'>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '39rem',
            }}>
            <TaskList />
          </Paper>
        </Grid>
        <TaskLayout />
      </Grid>
    </>
  );
}
