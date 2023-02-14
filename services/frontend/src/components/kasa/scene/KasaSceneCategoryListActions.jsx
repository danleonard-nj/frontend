import {
  AddCircleRounded,
  Delete,
  RemoveCircle,
} from '@mui/icons-material';
import { ButtonGroup, IconButton } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../../store/dialog/dialogSlice';
import {
  deleteSceneCategory,
  filterScenesByCategory,
} from '../../../store/kasa/actions/sceneActions';
import { setSelectedSceneCategory } from '../../../store/kasa/sceneSlice';

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
        onClick={() =>
          openSceneCategoryAddDialog(item?.scene_category_id)
        }>
        <AddCircleRounded />
      </IconButton>
      <IconButton
        edge='end'
        aria-label='comments'
        onClick={() =>
          openSceneCategoryRemoveDialog(item?.scene_category_id)
        }>
        <RemoveCircle />
      </IconButton>
    </ButtonGroup>
  );
};

export { KasaSceneCategoryListActions };
