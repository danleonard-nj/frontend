import {
  Add,
  AddCircleRounded,
  Delete,
  RemoveCircle,
} from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../../api/helpers/formattingHelpers';
import { dialogType, openDialog } from '../../../store/dialog/dialogSlice';
import {
  createSceneCategory,
  deleteSceneCategory,
  filterScenesByCategory,
  getCategories,
} from '../../../store/kasa/actions/sceneActions';
import {
  setIsNew,
  setSelectedSceneCategory,
} from '../../../store/kasa/sceneSlice';

const KasaSceneCategoryListActions = ({ item }) => {
  const dispatch = useDispatch();

  const prepareDialog = (sceneCategoryId) => {
    dispatch(setSelectedSceneCategory(sceneCategoryId));
    dispatch(filterScenesByCategory(sceneCategoryId));
  };

  const openSceneCategoryAddDialog = (sceneCategoryId) => {
    prepareDialog(sceneCategoryId);
    dispatch(openDialog(dialogType.sceneCategoryAdd));
  };

  const openSceneCategoryRemoveDialog = (sceneCategoryId) => {
    prepareDialog(sceneCategoryId);
    dispatch(openDialog(dialogType.sceneCategoryRemove));
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteSceneCategory(categoryId));
  };

  return (
    <ButtonGroup>
      <IconButton
        edge='end'
        aria-label='comments'
        onClick={() => handleDeleteCategory(item?.scene_category_id)}>
        <Delete />
      </IconButton>
      <IconButton
        edge='end'
        aria-label='comments'
        onClick={() => openSceneCategoryAddDialog(item?.scene_category_id)}>
        <AddCircleRounded />
      </IconButton>
      <IconButton
        edge='end'
        aria-label='comments'
        onClick={() => openSceneCategoryRemoveDialog(item?.scene_category_id)}>
        <RemoveCircle />
      </IconButton>
    </ButtonGroup>
  );
};

const KasaSceneCategoryList = () => {
  const dispatch = useDispatch();
  const sceneCategories = useSelector((x) => x.scene.sceneCategories) ?? [];
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSelectSceneCategory = (categoryId) => {
    dispatch(setSelectedSceneCategory(categoryId));
  };

  const handleToggleNewCategory = () => {
    setIsNewCategory(!isNewCategory);
  };

  const handleNewCategory = () => {
    setIsNewCategory(false);
    dispatch(createSceneCategory(newCategoryName));
    dispatch(getCategories());
  };

  return (
    <Paper elevation={4} sx={{ padding: 1, m: 1 }}>
      <Grid container>
        <Grid item lg={12}>
          <Grid container>
            <Grid item lg={6} sx={{ margin: 'auto' }}>
              <Typography variant='h6'>Scene Categories</Typography>
            </Grid>
            <Grid item lg={6}>
              <Box display='flex' justifyContent='flex-end'>
                <Button onClick={() => handleToggleNewCategory()}>
                  {isNewCategory ? 'Cancel' : 'Add'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12}>
          <List sx={scrollable}>
            {sceneCategories.map((item) => (
              <>
                <ListItem
                  secondaryAction={
                    <KasaSceneCategoryListActions item={item} />
                  }>
                  <ListItemButton
                    key={item?.scene_category_id}
                    onClick={() =>
                      handleSelectSceneCategory(item?.scene_category_id)
                    }>
                    <ListItemText primary={item.scene_category} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            ))}
            {isNewCategory && (
              <ListItem>
                <Box display='flex'>
                  <TextField
                    variant='standard'
                    onChange={(event) => setNewCategoryName(event.target.value)}
                  />
                  <IconButton onClick={() => handleNewCategory()}>
                    <Add />
                  </IconButton>
                </Box>
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { KasaSceneCategoryList };
