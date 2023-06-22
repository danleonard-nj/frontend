import {
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nestCommandNameMapping } from '../../api/data/nest';
import { getSensorInfo } from '../../store/nest/nestActions';
import { setSelectedSensor } from '../../store/nest/nestSlice';
import { GenericJsonEditor } from '../GenericJsonEditor';
import Spinner from '../Spinner';
import { SensorInfoCard } from '../nest/NestSensorCard';
import { useState } from 'react';
import { set } from 'lodash';
import { useEffect } from 'react';

const NestSensorInfoPage = () => {
  const dispatch = useDispatch();

  const { sensorInfo, sensorInfoLoading, selectedSensor } =
    useSelector((x) => x.nest);

  const [displayUnhealthySensors, setDispayUnhealthySensors] =
    useState(true);

  const [filteredSensorData, setFilteredSensorData] =
    useState(sensorInfo);

  const handleViewSensor = (sensor) => {
    dispatch(setSelectedSensor(sensor));
  };

  const handleRefreshSensorInfo = () => {
    dispatch(getSensorInfo());
  };

  const handleSwitchDisabledFilter = (checked) => {
    setDispayUnhealthySensors(checked);
    if (!checked) {
      setFilteredSensorData(
        sensorInfo.filter((x) => x.health.status === 'healthy')
      );
    } else {
      setFilteredSensorData(sensorInfo);
    }
  };

  useEffect(() => {
    setFilteredSensorData(sensorInfo);
  }, [sensorInfo]);

  return (
    <Grid container spacing={3}>
      <Grid item lg={6}>
        {sensorInfoLoading ? (
          <Spinner />
        ) : (
          <Grid container spacing={2}>
            {filteredSensorData.map((sensor) => (
              <Grid item lg={6}>
                <SensorInfoCard
                  sensor={sensor}
                  onViewClick={() => handleViewSensor(sensor)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
      <Grid item lg={6}>
        <Grid container spacing={2}>
          <Grid item lg={12} align='right'>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    value={displayUnhealthySensors}
                    defaultChecked
                    onChange={(e, checked) =>
                      handleSwitchDisabledFilter(checked)
                    }
                  />
                }
                label='Show Unhealthy'
              />
            </FormGroup>
          </Grid>
          <Grid item lg={12}>
            <GenericJsonEditor
              value={JSON.stringify(selectedSensor, null, 2)}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { NestSensorInfoPage };
