import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import {
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../../api/helpers/formattingHelpers';
import {
  getDevice,
  getDevices,
  getRegions,
  syncDevices,
} from '../../../store/kasa/actions/deviceActions';
import Spinner from '../../Spinner';

const KasaDeviceList = () => {
  const dispatch = useDispatch();
  const devices = useSelector((x) => x.device.devices);
  const devicesLoading = useSelector((x) => x.device.devicesLoading);

  useEffect(() => {
    dispatch(getDevices());
    dispatch(getRegions());
  }, []);

  const setSelectedDevice = (deviceId) => {
    dispatch(getDevice(deviceId));
  };

  const handleSync = () => {
    dispatch(syncDevices());
  };

  return devicesLoading ? (
    <Spinner />
  ) : (
    <List component='nav' sx={scrollable}>
      {devices?.length &&
        devices.map((item) => (
          <ListItemButton
            key={item?.device_id}
            onClick={() => setSelectedDevice(item.device_id)}>
            <ListItemIcon>
              <FiberSmartRecordIcon />
            </ListItemIcon>
            <ListItemText primary={item.device_name} />
          </ListItemButton>
        ))}
    </List>
  );
};

export default KasaDeviceList;
