import { Box, Grid, Paper, TextField } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSceneState } from '../../../store/kasa/actions/sceneActions';
import KasaSceneFlow from '../scene/KasaSceneFlow';
import KasaSceneFlowToolbar from './KasaSceneFlowToolbar';
import KasaSceneToolbar from './KasaSceneToolbar';

export default function KasaScene() {
  const dispatch = useDispatch();
  const scene = useSelector((x) => x.scene.scene);

  const handleNameChange = (event) => {
    dispatch(
      updateSceneState((scene) => ({
        ...scene,
        scene_name: event.target.value,
      }))
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={8} xs={12}>
        <TextField
          fullWidth
          label='Name'
          size='small'
          onChange={handleNameChange}
          value={scene?.scene_name ?? ''}
        />
      </Grid>
      <Grid item lg={4} xs={12} align='right'>
        <KasaSceneToolbar />
      </Grid>

      <Grid item lg={12} xs={12}>
        <KasaSceneFlowToolbar />
        <Paper elevation={4}>
          <Box sx={{ height: '50vh', width: '100%' }}>
            <KasaSceneFlow />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
