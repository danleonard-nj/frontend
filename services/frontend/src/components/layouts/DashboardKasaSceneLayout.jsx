import { Container, Grid, Paper, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRegions } from '../../store/kasa/actions/deviceActions';
import {
  getCategories,
  getScenes,
} from '../../store/kasa/actions/sceneActions';
import KasaSceneDisplayGrid from '../kasa/scene/KasaSceneDisplayGrid';

export default function DashboardKasaSceneLayout() {
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();

  const scenes = useSelector((x) => x.scene.scenes) ?? [];
  const sceneCategories = useSelector((x) => x.scene.sceneCategories) ?? [];
  const regions = useSelector((x) => x.device.regions) ?? [];

  useEffect(() => {
    if (!sceneCategories?.length) {
      dispatch(getCategories());
    }
    if (!regions?.length) {
      dispatch(getRegions());
    }
    if (!scenes?.length) {
      dispatch(getScenes());
    }
  }, [dispatch]);

  return (
    <Grid container spacing={3} id='kasa-scene-layout'>
      <Grid item lg={12} id='kasa-scene-layout-container'>
        <Container>
          <Paper
            id='kasa-scene-layout-container-paper'
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Tabs
              value={tab}
              onChange={(event, tab) => setTab(tab)}
              id='kasa-scene-layout-tabs'>
              <Tab label='Scenes' value={0} id='kasa-scene-layout-scene-tab' />
            </Tabs>
            {tab === 0 && <KasaSceneDisplayGrid />}
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
}
