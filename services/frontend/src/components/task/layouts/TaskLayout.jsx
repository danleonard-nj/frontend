import React from 'react';
import { Grid, Paper } from '@mui/material';
import TaskDetail from '../components/TaskDetail';
import IdentityClient from '../components/IdentityClient';
import JsonEditor from '../components/JsonEditor';
import { useSelector } from 'react-redux';
import { isJsonEditorVisible } from '../../../api/data/kasa/scene';

export const TaskLayout = () => {
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
            {isJsonEditorVisible(task) && <JsonEditor />}
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={3} xs={12} id='task-identity-client-container'>
        <Grid container spacing={3} id='task-identity-client-inner-container'>
          <Grid item lg={12} xs={12} id='task-identity-client-select-container'>
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
