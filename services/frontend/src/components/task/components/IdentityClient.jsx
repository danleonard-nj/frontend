import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTask } from '../../../store/task/taskSlice';
import DashboardTitle from '../../dashboard/DashboardTitle';

export default function IdentityClient() {
  const dispatch = useDispatch();
  const task = useSelector((store) => store.task.task) ?? {};
  const clients = useSelector((x) => x.task.clients) ?? [];

  function handleClientChange(event) {
    dispatch(
      setTask({
        ...task,
        [event.target.name]: event.target.value,
      })
    );
  }

  return (
    <>
      <DashboardTitle>Identity</DashboardTitle>
      <Grid container spacing={3} marginTop='1rem'>
        <Grid item lg={12}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>
              Active Directory App
            </InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              name='identityClientId'
              value={task?.identityClientId ?? ''}
              label='Client'
              onChange={handleClientChange}>
              {clients.map((client) => (
                <MenuItem
                  key={client.application_id}
                  value={client.default_scope}>
                  {client.application_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}
