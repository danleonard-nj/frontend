import { Box, Grid, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterScenesByCategory } from '../../../store/kasa/actions/sceneActions';
import KasaSceneButton from './KasaSceneButton';

const KasaSceneGrid = () => {
  const dispatch = useDispatch();
  const scenes = useSelector((x) => x.scene.scenes);
  const selectedSceneCategory =
    useSelector((x) => x.scene.selectedSceneCategory) ?? '';
  const filteredScenes = useSelector((x) => x.scene.filteredScenes) ?? [];

  useEffect(() => {
    dispatch(filterScenesByCategory(selectedSceneCategory));
  }, [selectedSceneCategory, scenes]);

  return (
    filteredScenes?.length > 0 && (
      <Paper elevation={3} sx={{ padding: 1, m: 1 }}>
        <Grid container spacing={3}>
          {filteredScenes.map((scene) => (
            <Grid
              item
              key={scene.scene_id}
              lg={12}
              sx={{ padding: 1 }}
              id={`kasa-scene-display-grid-scene-container-id-${scene.scene_id}`}>
              <Box sx={{ display: 'flex' }}>
                <KasaSceneButton scene={scene} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    )
  );
};

export { KasaSceneGrid };
