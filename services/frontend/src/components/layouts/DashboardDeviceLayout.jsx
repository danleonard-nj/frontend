import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import { Button, Grid, Paper } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDevice,
  getDevices,
  getRegions,
  syncDevices,
} from '../../store/kasa/actions/deviceActions';
import ListBox from '../ListBox';
import Spinner from '../Spinner';

export default function DashboardDeviceLayout() {
  const dispatch = useDispatch();
  const devices = useSelector((x) => x.device.devices);
  const devicesLoading = useSelector((x) => x.device.devicesLoading);

  useEffect(() => {
    dispatch(getDevices());
    dispatch(getRegions());
  }, [dispatch]);

  const setSelectedDevice = (deviceId) => {
    dispatch(getDevice(deviceId));
  };

  const handleSync = () => {
    dispatch(syncDevices());
  };

  return (
    <Grid container spacing={3} id='device-list-grid'>
      <Grid item lg={3} xs={12} md={6} id='device-list-container'>
        <Paper elevation={2}>
          {devicesLoading ? (
            <Spinner />
          ) : (
            <ListBox
              id='device-list'
              title='Devices'
              icon={<FiberSmartRecordIcon />}
              items={devices.map((device) => ({
                ...device,
                name: device.device_name,
                key: device.device_id,
              }))}
              onClick={(item) => setSelectedDevice(item.device_id)}
              toolbar={<Button onClick={handleSync}>Sync</Button>}
            />
          )}
        </Paper>
      </Grid>
      <Grid item lg={9} xs={12} md={6} id='device-card-container'></Grid>
    </Grid>
  );
}
