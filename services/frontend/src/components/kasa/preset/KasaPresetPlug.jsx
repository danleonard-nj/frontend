import {
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPreset } from '../../../store/kasa/presetSlice';

export default function KasaPresetPlug() {
  const dispatch = useDispatch();
  const preset = useSelector((x) => x.preset.preset);

  const onSwitchChange = (event) => {
    dispatch(
      setPreset({
        ...preset,
        definition: { ...preset.definition, state: event.target.checked },
      })
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={3}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                defaultChecked
                onChange={onSwitchChange}
                checked={preset?.definition?.state ?? false}
              />
            }
            label='On/Off'
          />
        </FormGroup>
      </Grid>
      <Grid item lg={3}>
        <TextField
          label='State'
          size='small'
          value={preset?.definition?.state ?? ''}
        />
      </Grid>
    </Grid>
  );
}
