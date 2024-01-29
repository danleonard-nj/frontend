import { Box, Button, Grid, Paper, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isJsonEditorVisible } from '../../../api/data/kasa/scene';
import {
  popErrorMessage,
  popMessage,
} from '../../../store/alert/alertActions';
import { setTask } from '../../../store/task/taskSlice';
import { GenericJsonEditor } from '../../GenericJsonEditor';
import DashboardTitle from '../../dashboard/DashboardTitle';
import { IdentityClient } from '../components/IdentityClient';
import { TaskDetail } from '../components/TaskDetail';

const getTaskJson = (task) => {
  return JSON.stringify(task?.payload, null, '\t');
};

const TaskJsonEditor = () => {
  const [json, setJson] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const { task = {} } = useSelector((x) => x.task);

  const theme = useTheme();
  const dispatch = useDispatch();

  // Parse and load the task json into the editor
  useEffect(() => {
    const taskJson = getTaskJson(task);

    setJson(taskJson);
    setInitialValue(taskJson);
  }, [task]);

  // Track unsaved changes
  useEffect(() => {
    setUnsavedChanges(initialValue !== json);
  }, [json]);

  const onChange = (value) => {
    setJson(value);
  };

  const handleParse = () => {
    try {
      const parsed = JSON.parse(json);

      dispatch(setTask({ ...task, payload: parsed }));
      dispatch(popMessage('JSON parsed successfully'));

      setUnsavedChanges(false);
    } catch (error) {
      dispatch(popErrorMessage('Failed to parse JSON'));
    }
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item lg={12}>
          <Grid container>
            <Grid item lg={10}>
              <DashboardTitle>
                {unsavedChanges ? 'Request Body *' : 'Request Body'}
              </DashboardTitle>
            </Grid>
            <Grid item lg={2} align='right'>
              <Button onClick={handleParse}>Parse</Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12}>
          <Box
            display='flex'
            border={
              unsavedChanges ? '3px solid' : '3px solid transparent'
            }
            borderRadius='7px'
            borderColor={
              unsavedChanges
                ? theme.palette.secondary.main
                : theme.palette.primary.main
            }>
            <GenericJsonEditor
              onChange={onChange}
              value={json}
              placeholder={'{}'}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export const TaskLayout = () => {
  const { task } = useSelector((x) => x.task);

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
