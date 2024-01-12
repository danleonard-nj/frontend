import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import { getRegions } from '../../store/kasa/actions/deviceActions';
import {
  filterScenesByCategory,
  getCategories,
  getScenes,
} from '../../store/kasa/actions/sceneActions';
import {
  setNewSceneCategoryToggle,
  setSelectedSceneCategory,
} from '../../store/kasa/sceneSlice';
import Spinner from '../Spinner';
import KasaSceneButton from '../kasa/scene/KasaSceneButton';

export default function DashboardKasaSceneLayout() {
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();

  const {
    scenes,
    sceneCategories,
    newSceneCategoryToggle,
    filteredScenes,
    scenesLoading,
  } = useSelector((x) => x.scene);

  scenes ??= [];
  sceneCategories ??= [];
  filteredScenes ??= [];

  const openSceneCategoryAddDialog = () => {
    dispatch(openDialog(dialogType.sceneCategoryAdd));
  };

  const regions = useSelector((x) => x.device.regions) ?? [];

  const handleAddCategory = () => {
    dispatch(setNewSceneCategoryToggle(!newSceneCategoryToggle));
  };

  const handleTabChange = (event, value) => {
    dispatch(getScenes());
    setTab(value);
    dispatch(setSelectedSceneCategory(value));
    dispatch(filterScenesByCategory(value));
  };

  useEffect(() => {
    if (!sceneCategories?.length) {
      dispatch(getCategories());
      dispatch(setSelectedSceneCategory('All'));
    }

    !regions?.length && dispatch(getRegions());
    !scenes?.length && dispatch(getScenes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSelectedSceneCategory(tab));
    dispatch(filterScenesByCategory(tab));
  }, [tab, scenesLoading]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={12}>
          <ButtonGroup>
            <Button onClick={openSceneCategoryAddDialog}>
              {newSceneCategoryToggle ? 'Cancel' : 'Add Scene'}
            </Button>
            <Button onClick={handleAddCategory}>
              {newSceneCategoryToggle ? 'Cancel' : 'New Category'}
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item lg={12} xs={12} sm={12}>
          {scenesLoading ? (
            <Spinner />
          ) : (
            <Paper
              id='kasa-scene-layout-container-paper'
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}>
              <Grid container spacing={3}>
                <Grid item lg={12} xs={12} sm={12}>
                  <AppBar position='static' color='inherit'>
                    <Tabs
                      value={tab}
                      variant='scrollable'
                      scrollButtons
                      allowScrollButtonsMobile
                      onChange={handleTabChange}>
                      {sceneCategories?.map((sc) => (
                        <Tab
                          key={sc.scene_category_id}
                          label={sc.scene_category}
                          value={sc.scene_category_id}
                          id='kasa-scene-layout-scene-tab'
                        />
                      ))}
                      <Tab
                        label='all'
                        value=''
                        id='kasa-all-scenes-tab'
                      />
                    </Tabs>
                  </AppBar>
                </Grid>
                <Grid item lg={12} sm={12} xs={12}>
                  <Box p={2}>
                    <Grid container spacing={3}>
                      <Grid item lg={4} xs={12} sm={12}>
                        <Grid container spacing={1}>
                          {filteredScenes.map((scene) => (
                            <Grid
                              key={scene.scene_id}
                              item
                              lg={12}
                              xs={12}
                              sm={12}
                              p={1}>
                              <KasaSceneButton scene={scene} />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
}
