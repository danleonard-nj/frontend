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
import { dialogType, openDialog } from '../../../store/dialog/dialogSlice';
import { saveTask, updateTaskState } from '../../../store/task/taskActions';
import DashboardTitle from '../../dashboard/DashboardTitle';
import Spinner from '../../Spinner';

export default function TaskDetail() {
  const dispatch = useDispatch();
  const task = useSelector((store) => store.task.task) ?? {};
  const taskFetching = useSelector((x) => x.task.taskFetching);

  function handleChange(event) {
    dispatch(
      updateTaskState((task) => ({
        ...task,
        [event.target.name]: event.target.value,
      }))
    );
  }

  function handleSave() {
    dispatch(saveTask());
  }

  function handleDelete() {
    dispatch(openDialog(dialogType.deleteTask));
  }

  return (
    <>
      {taskFetching ? (
        <Spinner />
      ) : (
        <>
          <Grid container spacing={3} sx={{ marginBottom: 1 }}>
            <Grid item lg={9} xs={9}>
              <DashboardTitle>{task.taskName}</DashboardTitle>
            </Grid>
            <Grid item lg={3} xs={3} align='right'>
              <ButtonGroup variant='text'>
                <Button onClick={handleSave}>Save</Button>
                <Button color='error' onClick={handleDelete}>
                  Delete
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={9}>
              <TextField
                required
                id='taskName'
                name='taskName'
                label='Task Name'
                value={task?.taskName ?? ''}
                onChange={(event) => handleChange(event)}
                fullWidth
                variant='standard'
              />
            </Grid>

            <Grid item lg={2} xs={3}>
              <FormControl fullWidth>
                <InputLabel id='method'>Method</InputLabel>
                <Select
                  labelId='method'
                  value={task?.method ?? ''}
                  name='method'
                  label='Method'
                  onChange={(event) => handleChange(event)}>
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
                onChange={(event) => handleChange(event)}
                fullWidth
                variant='standard'
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
