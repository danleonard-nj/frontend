import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTask } from '../../../store/task/taskSlice';
import DashboardTitle from '../../dashboard/DashboardTitle';
import { useState } from 'react';
import { useEffect } from 'react';
import { sortBy } from 'lodash';

const IdentityClient = () => {
  const dispatch = useDispatch();

  const {
    task = {},
    clients = [],
    clientsLoading = true,
  } = useSelector((x) => x.task);

  const [clientList, setClientList] = useState([]);

  const handleClientStateChange = (event) => {
    dispatch(
      setTask({
        ...task,
        [event.target.name]: event.target.value,
      })
    );
  };

  useEffect(() => {
    setClientList(sortBy(clients, (x) => x.application_name));
  }, [clients]);

  return (
    <>
      <DashboardTitle>Identity</DashboardTitle>
      <Grid container spacing={3} marginTop='1rem'>
        <Grid item lg={12} xs={12}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>
              Active Directory App
            </InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              name='identityClientId'
              value={task?.identityClientId ?? ''}
              label='Active Directory App'
              onChange={handleClientStateChange}>
              {clientList.map((client) => (
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
};

export { IdentityClient };
