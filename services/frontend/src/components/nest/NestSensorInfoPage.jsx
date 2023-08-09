import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensorInfo } from '../../store/nest/nestActions';
import { setSelectedSensor } from '../../store/nest/nestSlice';
import { GenericJsonEditor } from '../GenericJsonEditor';
import Spinner from '../Spinner';
import { SensorInfoCard } from '../nest/NestSensorCard';

const NestSensorInfoPage = () => {
  const [displayUnhealthySensors, setDispayUnhealthySensors] =
    useState(true);
  const [panelExpanded, setPanelExpanded] = useState(false);

  const { sensorInfo, sensorInfoLoading, selectedSensor } =
    useSelector((x) => x.nest);

  const [filteredSensorData, setFilteredSensorData] =
    useState(sensorInfo);

  const dispatch = useDispatch();

  const handleViewSensor = (sensor) => {
    dispatch(setSelectedSensor(sensor));
    setPanelExpanded(true);
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

  const onDrawerClose = () => {
    setPanelExpanded(false);
  };

  return (
    <div>
      <Grid container spacing={3}>
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

        <Grid item lg={9}>
          {sensorInfoLoading ? (
            <Spinner />
          ) : (
            <Grid container spacing={2}>
              {filteredSensorData.map((sensor) => (
                <Grid item lg={4} xs={12} maxWidth={250}>
                  <SensorInfoCard
                    sensor={sensor}
                    onViewClick={() => handleViewSensor(sensor)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
      <Drawer
        open={panelExpanded}
        anchor='right'
        onClose={onDrawerClose}>
        <Box
          sx={{
            width: '30vw',
            padding: 1,
          }}
          role='presentation'>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item lg={12}>
                <Typography variant='h6'>Device Record</Typography>
              </Grid>
              <Grid item lg={12}>
                <GenericJsonEditor
                  value={JSON.stringify(selectedSensor, null, 2)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Drawer>
    </div>
  );
};

export { NestSensorInfoPage };
