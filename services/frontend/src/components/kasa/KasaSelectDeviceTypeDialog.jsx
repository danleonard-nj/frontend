import {
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deviceTypes } from '../../api/data/kasa/device';
import { getNewPreset } from '../../api/data/kasa/preset';
import { closeDialog, dialogType } from '../../store/dialog/dialogSlice';
import { setNewPreset, setPreset } from '../../store/kasa/presetSlice';

export default function KasaSelectDeviceTypeDialog() {
  const dispatch = useDispatch();
  const dialogState =
    useSelector((x) => x.dialog[dialogType.addPreset]) ?? false;

  const [selectedDeviceType, setSelectedDeviceType] = useState(
    deviceTypes.SmartPlug
  );

  const handleClose = () => {
    dispatch(closeDialog(dialogType.addPreset));
  };

  const handleSelectDeviceType = (event) => {
    setSelectedDeviceType(event.target.value);
  };

  const handleOk = () => {
    handleClose();
    dispatch(setPreset(getNewPreset(selectedDeviceType)));
    dispatch(setNewPreset(true));
  };

  return (
    <Dialog onClose={handleClose} open={dialogState}>
      <DialogTitle>Device Type</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 1 }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Device Type</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={selectedDeviceType}
              label='Device Type'
              onChange={handleSelectDeviceType}>
              <MenuItem value={deviceTypes.SmartLight}>SmartLight</MenuItem>
              <MenuItem value={deviceTypes.SmartPlug}>SmartPlug</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={handleOk}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
