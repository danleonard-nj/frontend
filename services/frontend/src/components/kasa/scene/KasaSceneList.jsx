import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { setScene } from '../../../store/kasa/sceneSlice';
import { updateFlow } from '../../../store/kasa/flowSlice';
import Spinner from '../../Spinner';
import { scrollable } from '../../../api/helpers/formattingHelpers';

export default function KasaSceneList() {
  const dispatch = useDispatch();
  const scenes = useSelector((x) => x.scene?.scenes) ?? [];
  const scenesLoading = useSelector((x) => x.scene.scenesLoading);

  function handleSceneSelect(scene) {
    dispatch(setScene(scene));
    dispatch(updateFlow(scene?.flow ?? []));
  }

  return scenesLoading ? (
    <Spinner />
  ) : (
    <>
      <List component='nav' sx={scrollable}>
        {scenes?.length &&
          scenes.map((item) => (
            <ListItemButton
              key={item?.scene_id}
              onClick={() => handleSceneSelect(item)}>
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary={item.scene_name} />
            </ListItemButton>
          ))}
      </List>
    </>
  );
}
