import { Box, Grid, Slider } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rangeMarks } from '../../api/data/nest';
import { getFormattedCelsius } from '../../api/helpers/nestHelpers';
import { setCommandParameters } from '../../store/nest/nestSlice';

const NestThermostatSetRange = () => {
  const dispatch = useDispatch();

  const { commandParameters } = useSelector((x) => x.nest);

  // Local state for slider for chage
  const [rangeValue, setRangeValue] = useState([
    commandParameters?.cool_degrees_fahrenheit ?? 72,
    commandParameters?.heat_degrees_fahrenheit ?? 65,
  ]);

  // Captue the range value and set the thermostat
  // command params
  const handleValueCapture = (event, value) => {
    dispatch(
      setCommandParameters({
        ...commandParameters,
        cool_degrees_fahrenheit: value[1],
        heat_degrees_fahrenheit: value[0],
      })
    );
  };

  // Handle the slider change
  const handleChange = (event, newValue) => {
    setRangeValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={9} xs={12}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={rangeValue}
          onChange={handleChange}
          onChangeCommitted={handleValueCapture}
          valueLabelDisplay='auto'
          getAriaValueText={getFormattedCelsius}
          min={60}
          max={80}
          marks={rangeMarks}
          fullWidth
        />
      </Grid>
      <Grid item lg={3} align='right'>
        <Box>
          Cool: {rangeValue[0]}&deg;F
          <br />
          Heat: {rangeValue[1]}&deg;F
        </Box>
      </Grid>
    </Grid>
  );
};

const NestThermostatSetCool = () => {
  const dispatch = useDispatch();

  // Parameters for sending the thermostat command
  const { commandParameters } = useSelector((x) => x.nest);

  // Local state for slider
  const [coolValue, setCoolValue] = useState(
    commandParameters?.cool_degrees_fahrenheit ?? 68
  );

  // Capture the temp and set the thermostat command params
  const handleValueCapture = (value) => {
    dispatch(
      setCommandParameters({
        ...commandParameters,
        cool_degrees_fahrenheit: value,
      })
    );
  };

  // Handle the slider change
  const handleChange = (event, newValue) => {
    setCoolValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={9} xs={12}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={coolValue}
          onChange={handleChange}
          onChangeCommitted={(e, v) => handleValueCapture(v)}
          valueLabelDisplay='auto'
          getAriaValueText={getFormattedCelsius}
          min={60}
          max={80}
          marks={rangeMarks}
          fullWidth
        />
      </Grid>
      <Grid item lg={3} xs={12} align='right'>
        <Box>Cool: {coolValue}&deg;F</Box>
      </Grid>
    </Grid>
  );
};

const NestThermostatSetHeat = () => {
  const dispatch = useDispatch();

  const { commandParameters } = useSelector((x) => x.nest);

  const [value, setValue] = useState(
    commandParameters?.heat_degrees_fahrenheit ?? 78
  );

  const handleValueCapture = (event, value) => {
    dispatch(
      setCommandParameters({
        ...commandParameters,
        heat_degrees_fahrenheit: value,
      })
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={9} xs={12}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleValueCapture}
          valueLabelDisplay='auto'
          getAriaValueText={getFormattedCelsius}
          min={60}
          max={80}
          marks={rangeMarks}
        />
      </Grid>
      <Grid item lg={3} align='right'>
        <Box>Heat: {value}&deg;F</Box>
      </Grid>
    </Grid>
  );
};

export {
  NestThermostatSetCool,
  NestThermostatSetHeat,
  NestThermostatSetRange,
};
