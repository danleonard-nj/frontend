import ScheduleIcon from '@mui/icons-material/Schedule';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../../api/helpers/formattingHelpers';
import { getPreset } from '../../../store/kasa/actions/presetActions';
import Spinner from '../../Spinner';

const KasaPresetList = () => {
  const dispatch = useDispatch();

  const { presets, presetsLoading } = useSelector((x) => x.preset);

  const handlePresetSelect = (preset) => {
    dispatch(getPreset(preset.preset_id));
  };

  return (
    <>
      {presetsLoading ? (
        <Spinner />
      ) : (
        <>
          <List component='nav' sx={scrollable}>
            {presets?.length &&
              presets.map((item) => (
                <ListItemButton
                  key={item?.preset_id}
                  onClick={() => handlePresetSelect(item)}>
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.preset_name} />
                </ListItemButton>
              ))}
          </List>
        </>
      )}
    </>
  );
};

export { KasaPresetList };
