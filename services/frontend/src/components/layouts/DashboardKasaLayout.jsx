import { Grid, Paper, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getDevices } from '../../store/kasa/actions/deviceActions';
import { getPresets } from '../../store/kasa/actions/presetActions';
import { getScenes } from '../../store/kasa/actions/sceneActions';
import KasaDeviceLayout from '../kasa/device/KasaDeviceLayout';
import KasaDeviceList from '../kasa/device/KasaDeviceList';
import KasaPreset from '../kasa/preset/KasaPreset';
import KasaPresetList from '../kasa/preset/KasaPresetList';
import KasaScene from '../kasa/scene/KasaScene';
import KasaSceneList from '../kasa/scene/KasaSceneList';

export default function DashboardKasaLayout() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    dispatch(getPresets());
    dispatch(getScenes());
    dispatch(getDevices());
  }, [dispatch]);

  function handleTabSelect(event, value) {
    setTab(value);
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={3} xs={12} md={4} id='kasa-tab-list-container'>
        <Tabs value={tab} onChange={handleTabSelect}>
          <Tab label='Presets' id='kasa-tab-list-presets-tab' />
          <Tab label='Scenes' id='kasa-tab-list-scenes-tab' />
          <Tab label='Devices' id='kasa-tab-list-devices-tab' />
          <Tab label='Regions' id='kasa-tab-list-regions-tab' />
        </Tabs>
        <Paper>
          {tab === 0 && <KasaPresetList id='kasa-tab-content-preset-list' />}
          {tab === 1 && <KasaSceneList id='kasa-tab-content-scene-list' />}
          {tab === 2 && <KasaDeviceList id='kasa-tab-content-scene-list' />}
        </Paper>
      </Grid>
      <Grid item lg={9} xs={12} md={8} id='kasa-tab-content-container'>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}>
          {tab === 0 && <KasaPreset id='kasa-tab-content-preset' />}
          {tab === 1 && <KasaScene id='kasa-tab-content-scene' />}
          {tab === 2 && <KasaDeviceLayout />}
        </Paper>
      </Grid>
    </Grid>
  );
}
