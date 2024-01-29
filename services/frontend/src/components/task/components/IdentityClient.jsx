import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTask } from '../../../store/task/taskSlice';
import DashboardTitle from '../../dashboard/DashboardTitle';

const IdentityClient = () => {
  const dispatch = useDispatch();

  const { task = {}, clients = [] } = useSelector((x) => x.task);

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
