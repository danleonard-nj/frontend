import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { getColor, getDefaultColor } from '../../../api/data/kasa/preset';
import { whiteBalanceTemperatures } from '../../../api/data/kasa/whiteBalances';
import { setPreset } from '../../../store/kasa/presetSlice';
import KasaPresetParameterDisplay from '../preset/KasaPresetParameterDisplay';

export default function KasaPresetLight() {
  const dispatch = useDispatch();
  const preset = useSelector((x) => x.preset.preset);

  const { hue, saturation, temperature, state, brightness } = useSelector(
    (x) => x.preset.preset.definition
  );

  const [color, setColor] = useState(getDefaultColor());
  const [localBrightness, setBrightness] = useState(0);
  const [localTemperature, setTemperature] = useState(0);
  const [localOnOff, setOnOff] = useState(false);

  useEffect(() => {
    setBrightness(brightness);
    setOnOff(state);
    setTemperature(temperature);
    setColor({ ...color, hsl: getColor(hue, saturation) });
  }, [preset.preset_id]);

  useEffect(() => {
    dispatch(
      setPreset({
        ...preset,
        definition: {
          brightness: localBrightness,
          hue: Math.round(color.hsl.h),
          saturation: Math.round(color.hsl.s * 100),
          state: localOnOff,
          temperature: localTemperature ?? 0,
        },
      })
    );
  }, [color, localBrightness, localTemperature, localOnOff]);

  const handleBrightnessChange = (event, value) => {
    setBrightness(value);
  };

  const handleOnOffChange = (event) => {
    setOnOff(event.target.checked);
  };

  const handleColorChange = (color) => {
    setColor(color);
  };

  const handleTemperatureChange = (event) => {
    setColor(getDefaultColor());
    setTemperature(event.target.value);
  };

  return (
    <Grid container spacing={3} id='kasa-preset-light-container'>
      <Grid item lg={6} xs={12} md={6} id='kasa-preset-light-color-container'>
        <SketchPicker
          color={color.hsl}
          onChange={handleColorChange}
          id='kasa-preset-light-sketch-picker'
        />
      </Grid>
      <Grid item lg={6} xs={12} md={6}>
        <Grid container spacing={3}>
          <Grid
            item
            lg={6}
            xs={6}
            id='kasa-preset-light-power-slider-container'>
            <Typography id='kasa-preset-light-power-slider-header' gutterBottom>
              On / Off
            </Typography>
            <Switch
              checked={localOnOff}
              onChange={handleOnOffChange}
              id='kasa-preset-light-power-slider'
            />
          </Grid>
          <Grid
            item
            lg={6}
            xs={6}
            id='kasa-preset-light-brightness-slider-container'>
            <Typography
              id='kasa-preset-light-brightness-slider-header'
              gutterBottom>
              Brightness
            </Typography>
            <Slider
              aria-label='Default'
              valueLabelDisplay='auto'
              min={0}
              max={100}
              value={localBrightness}
              onChange={handleBrightnessChange}
              id='kasa-preset-light-brightness-slider'></Slider>
          </Grid>
          <Grid item lg={12} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='kasa-preset-light-white-balance-label'>
                White Balance
              </InputLabel>
              <Select
                labelId='kasa-preset-light-white-balance-label'
                id='white-balance-select'
                value={localTemperature}
                label='Temperature'
                onChange={handleTemperatureChange}>
                {whiteBalanceTemperatures.map((temp) => (
                  <MenuItem value={temp.value}>{temp.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <KasaPresetParameterDisplay preset={preset} />
        </Grid>
      </Grid>
    </Grid>
  );
}
