import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';
import {
  filterScenesByCategory,
  getAllScenes,
  getScenes,
  updateSceneCategory,
} from '../../../store/kasa/actions/sceneActions';

const KasaSceneCategoryAddDialog = () => {
  const dispatch = useDispatch();
  const scenes = useSelector((x) => x.scene.scenes) ?? [];
  const isVisible = useSelector((x) => x.dialog[dialogType.sceneCategoryAdd]);
  const selectedSceneCategory = useSelector(
    (x) => x.scene.selectedSceneCategory
  );
  const [sceneList, setSceneList] = useState([]);
  const [selected, setSelected] = useState('');

  const getFilteredSceneList = () => {
    return scenes.filter((x) => x.scene_category_id !== selectedSceneCategory);
  };

  const handleClose = () => {
    setSelected('');
    dispatch(closeDialog(dialogType.sceneCategoryAdd));
  };

  const handleAddScene = () => {
    dispatch(updateSceneCategory(selected, selectedSceneCategory));
    dispatch(getScenes());
    handleClose();
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    setSceneList(getFilteredSceneList());
  }, [selectedSceneCategory]);

  return (
    <Dialog onClose={handleClose} open={isVisible} maxWidth='sm' fullWidth>
      <DialogTitle>Add Scene</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 1 }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Scene</InputLabel>
            <Select
              variant='standard'
              labelId='demo-simple-select-label'
              value={selected ?? ''}
              onChange={handleChange}>
              {sceneList?.map((scene, index) => (
                <MenuItem
                  key={index}
                  id={`schedule-add-link-select-task-${index}`}
                  value={scene.scene_id}>
                  {scene.scene_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddScene}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export { KasaSceneCategoryAddDialog as KasaSceneCategoryDialog };
