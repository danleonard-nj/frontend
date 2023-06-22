import { Box, Grid, Slider } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rangeMarks } from '../../api/data/nest';
import { getFormattedCelsius } from '../../api/helpers/nestHelpers';
import { setCommandParameters } from '../../store/nest/nestSlice';

const NestThermostatSetRange = () => {
  const dispatch = useDispatch();

  const { commandParameters } = useSelector((x) => x.nest);

  const [value, setValue] = useState([
    commandParameters?.cool_degrees_fahrenheit ?? 72,
    commandParameters?.heat_degrees_fahrenheit ?? 65,
  ]);

  const handleValueCapture = (event, value) => {
    dispatch(
      setCommandParameters({
        ...commandParameters,
        cool_degrees_fahrenheit: value[1],
        heat_degrees_fahrenheit: value[0],
      })
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={6} xs={12}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleValueCapture}
          valueLabelDisplay='auto'
          getAriaValueText={getFormattedCelsius}
          min={60}
          max={90}
          marks={rangeMarks}
          fullWidth
        />
      </Grid>
      <Grid item lg={6}>
        <Box>
          Cool: {value[0]}&deg;F
          <br />
          Heat: {value[1]}&deg;F
        </Box>
      </Grid>
    </Grid>
  );
};

const NestThermostatSetCool = () => {
  const dispatch = useDispatch();

  const { commandParameters } = useSelector((x) => x.nest);

  const [value, setValue] = useState(
    commandParameters?.cool_degrees_fahrenheit ?? 68
  );

  const handleValueCapture = (value) => {
    dispatch(
      setCommandParameters({
        ...commandParameters,
        cool_degrees_fahrenheit: value,
      })
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={6} xs={12}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={handleChange}
          onChangeCommitted={(e, v) => handleValueCapture(v)}
          valueLabelDisplay='auto'
          getAriaValueText={getFormattedCelsius}
          min={62}
          max={82}
          marks={rangeMarks}
        />
      </Grid>
      <Grid item lg={6} xs={12}>
        <Box>Cool: {value}&deg;F</Box>
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
      <Grid item lg={6} xs={12}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleValueCapture}
          valueLabelDisplay='auto'
          getAriaValueText={getFormattedCelsius}
          min={60}
          max={90}
          marks={rangeMarks}
        />
      </Grid>
      <Grid item lg={6}>
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
