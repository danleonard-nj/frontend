import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../../store/dialog/dialogSlice';
import {
  saveTask,
  updateTaskState,
} from '../../../store/task/taskActions';
import DashboardTitle from '../../dashboard/DashboardTitle';
import Spinner from '../../Spinner';

const TaskDetail = () => {
  const dispatch = useDispatch();
  const {
    task = {},
    taskFetching = false,
    isTaskModified = false,
  } = useSelector((store) => store.task);

  const handleTaskChange = (event) => {
    dispatch(
      updateTaskState((task) => ({
        ...task,
        [event.target.name]: event.target.value,
      }))
    );

    setTaskModified();
  };

  const handleSave = () => {
    dispatch(saveTask());
  };

  const handleDelete = () => {
    dispatch(openDialog(dialogType.deleteTask));
  };

  const setTaskModified = () => {
    if (!isTaskModified) {
      dispatch(updateTaskState(true));
    }
  };

  return (
    <>
      {taskFetching ? (
        <Spinner />
      ) : (
        <>
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            sx={{ marginBottom: 2 }}>
            <DashboardTitle>{task.taskName}</DashboardTitle>
            <ButtonGroup variant='text'>
              <Button onClick={handleSave}>Save</Button>
              <Button color='error' onClick={handleDelete}>
                Delete
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={7}>
              <TextField
                required
                id='taskName'
                name='taskName'
                label='Task Name'
                value={task?.taskName ?? ''}
                onChange={(event) => handleTaskChange(event)}
                fullWidth
                variant='standard'
              />
            </Grid>

            <Grid item lg={2} xs={5}>
              <FormControl fullWidth>
                <InputLabel id='method'>Method</InputLabel>
                <Select
                  labelId='method'
                  value={task?.method ?? ''}
                  name='method'
                  label='Method'
                  onChange={(event) => handleTaskChange(event)}>
                  {['POST', 'GET', 'PUT', 'DELETE'].map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={10} xs={12}>
              <TextField
                required
                id='endpoint'
                name='endpoint'
                label='Endpoint'
                value={task?.endpoint ?? ''}
                onChange={(event) => handleTaskChange(event)}
                fullWidth
                variant='standard'
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export { TaskDetail };
