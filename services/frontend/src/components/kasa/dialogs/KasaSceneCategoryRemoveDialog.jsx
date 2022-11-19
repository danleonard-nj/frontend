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
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';
import {
  getScenes,
  updateSceneCategory,
} from '../../../store/kasa/actions/sceneActions';

const KasaSceneCategoryRemoveDialog = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(
    (x) => x.dialog[dialogType.sceneCategoryRemove]
  );
  const filteredScenes = useSelector((x) => x.scene.filteredScenes);

  const [selected, setSelected] = useState('');

  const handleClose = () => {
    setSelected('');
    dispatch(closeDialog(dialogType.sceneCategoryRemove));
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const handleRemoveScene = () => {
    if (selected) {
      dispatch(updateSceneCategory(selected, null));
      dispatch(getScenes());
      handleClose();
    }
  };

  return (
    <Dialog onClose={handleClose} open={isVisible} maxWidth='sm' fullWidth>
      <DialogTitle>Remove Scene</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 1 }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Scene</InputLabel>
            <Select
              variant='standard'
              labelId='demo-simple-select-label'
              value={selected ?? ''}
              onChange={handleChange}>
              {filteredScenes?.map((scene, index) => (
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
        <Button onClick={handleRemoveScene}>Remove</Button>
      </DialogActions>
    </Dialog>
  );
};

export { KasaSceneCategoryRemoveDialog };
