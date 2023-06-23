import { Button, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isJsonEditorVisible } from '../../../api/data/kasa/scene';
import { GenericJsonEditor } from '../../GenericJsonEditor';
import DashboardTitle from '../../dashboard/DashboardTitle';
import { IdentityClient } from '../components/IdentityClient';
import TaskDetail from '../components/TaskDetail';
import {
  popErrorMessage,
  popMessage,
} from '../../../store/alert/alertActions';
import { setTask } from '../../../store/task/taskSlice';

const tryStringify = (value) => {
  return value ? JSON.stringify(value) : null;
};

const getTaskJson = (task) => {
  return JSON.stringify(task?.payload, null, '\t');
};

const TaskJsonEditor = () => {
  const dispatch = useDispatch();

  console.log('render json editor');
  const { task = {} } = useSelector((x) => x.task);

  const [json, setJson] = useState('');

  useEffect(() => {
    setJson(getTaskJson(task));
  }, [task]);

  const onChange = (value) => {
    setJson(value);
  };

  const handleParse = () => {
    try {
      const parsed = JSON.parse(json);
      dispatch(setTask({ ...task, payload: parsed }));
      dispatch(popMessage('JSON parsed successfully'));
    } catch (error) {
      dispatch(popErrorMessage('Failed to parse JSON'));
    }
  };

  return (
    <>
      <Grid container spacing={3} sx={{ marginBottom: 2 }}>
        <Grid item lg={10}>
          <DashboardTitle>Request Body</DashboardTitle>
        </Grid>
        <Grid item lg={2} align='right'>
          <Button onClick={handleParse}>Parse</Button>
        </Grid>
      </Grid>
      <span style={{ display: 'flex' }}>
        <GenericJsonEditor
          onChange={onChange}
          value={json}
          placeholder={'{}'}
        />
      </span>
    </>
  );
};

export const TaskLayout = () => {
  const dispatch = useDispatch();
  const task = useSelector((x) => x.task.task);

  return (
    <>
      <Grid item lg={6} md={7}>
        <Grid container spacing={3}>
          <Grid item lg={12} xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '13rem',
              }}>
              <TaskDetail />
            </Paper>
          </Grid>

          <Grid item lg={12} xs={12} id='task-json-editor-container'>
            {isJsonEditorVisible(task) && <TaskJsonEditor />}
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={3} xs={12} id='task-identity-client-container'>
        <Grid
          container
          spacing={3}
          id='task-identity-client-inner-container'>
          <Grid
            item
            lg={12}
            xs={12}
            id='task-identity-client-select-container'>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '12rem',
              }}>
              <IdentityClient />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
