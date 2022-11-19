import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { createInputNode, createOutputNode } from '../../../api/data/flow';
import {
  getDeviceOptions,
  getPresetOptions,
} from '../../../api/data/kasa/scene';
import { updateFlowState } from '../../../store/kasa/actions/flowActions';

export default function KasaSceneFlowToolbar() {
  const dispatch = useDispatch();
  const presets = useSelector((x) => x.preset.presets);
  const devices = useSelector((x) => x.device.devices);
  const flow = useSelector((x) => x.flow.flow);

  const [selectedPreset, setSelectedPreset] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');

  const deviceOptions = getDeviceOptions(devices, flow) ?? [];
  const presetOptions = getPresetOptions(presets, flow) ?? [];

  const handleSelectPreset = (event) => {
    setSelectedPreset(event.target.value);
  };

  const handleSelectDevice = (event) => {
    setSelectedDevice(event.target.value);
  };

  const handleAddPreset = () => {
    const preset = presets.filter((x) => x.preset_id === selectedPreset)[0];
    const presetNode = createInputNode(preset.preset_id, preset.preset_name);
    dispatch(updateFlowState((flow) => [...flow, presetNode]));
  };

  const handleAddDevice = () => {
    const device = devices.filter((x) => x.device_id === selectedDevice)[0];
    const deviceNode = createOutputNode(device.device_id, device.device_name);
    dispatch(updateFlowState((flow) => [...flow, deviceNode]));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Grid container spacing={3}>
        <Grid item lg={12} xs={12}>
          <Grid container spacing={3}>
            <Grid
              item
              lg={6}
              md={6}
              xs={12}
              id='kasa-scene-preset-select-container'>
              <FormControl fullWidth id='kasa-scene-preset-select-form'>
                <Box display='flex' id='kasa-scene-preset-select-flex'>
                  <InputLabel id='kasa-scene-preset-select-label' size='small'>
                    Preset
                  </InputLabel>

                  <Select
                    fullWidth
                    size='small'
                    labelId='kasa-scene-preset-select-label'
                    id='kasa-scene-preset-select'
                    label='Preset'
                    value={selectedPreset}
                    onChange={handleSelectPreset}>
                    {presetOptions.map((preset) => (
                      <MenuItem key={preset.preset_id} value={preset.preset_id}>
                        {preset?.preset_name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={handleAddPreset}
                    sx={{ marginLeft: 1, width: '10%' }}>
                    Add
                  </Button>
                </Box>
              </FormControl>
            </Grid>
            <Grid
              item
              lg={6}
              md={6}
              xs={12}
              id='kasa-scene-device-select-container'>
              <FormControl fullWidth id='kasa-scene-device-select-form'>
                <Box display='flex' id='kasa-scene-device-select-flex'>
                  <InputLabel id='kasa-scene-device-select-label' size='small'>
                    Device
                  </InputLabel>
                  <Select
                    fullWidth
                    size='small'
                    labelId='kasa-scene-device-select-label'
                    id='kasa-scene-device-select'
                    label='Preset'
                    value={selectedDevice}
                    onChange={handleSelectDevice}>
                    {deviceOptions.map((device) => (
                      <MenuItem key={device.device_id} value={device.device_id}>
                        {device?.device_name}
                      </MenuItem>
                    ))}
                  </Select>

                  <Button
                    size='small'
                    variant='contained'
                    onClick={handleAddDevice}
                    sx={{ marginLeft: 1, width: '10%' }}>
                    Add
                  </Button>
                </Box>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
