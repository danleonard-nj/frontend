import {
  Button,
  Chip,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSensorInfo,
  getThermostatInfo,
} from '../../store/nest/nestActions';
import { useEffect } from 'react';
import styles from '../../styles.module.css';
import CheckIcon from '@mui/icons-material/Check';
import { setSelectedSensor } from '../../store/nest/nestSlice';
import Spinner from '../Spinner';

const getFormattedLastContactDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const getSensorStatusIconColor = (status) => {
  // No healt info available
  if (!status) {
    return 'grey';
  }

  return status === 'healthy' ? 'green' : 'red';
};

const NestSensorTooltipContent = ({ sensor }) => {
  return (
    <div>
      <Typography>
        {'Sensor ID: '}
        {sensor.device_id}
      </Typography>
      <br />
      <Typography>
        {'Last contact: '}
        {getFormattedLastContactDate(sensor.health.last_contact)}
      </Typography>
      <br />
      <Typography>
        {'Seconds since last contact: '}
        {sensor.health.seconds_elapsed}
      </Typography>
    </div>
  );
};

const NestSensorChip = ({ sensor }) => {
  const dispatch = useDispatch();

  const chipStyles = {
    color: getSensorStatusIconColor(sensor.health.status),
  };

  const handleClick = () => {
    console.log('click!');
    dispatch(setSelectedSensor(sensor));
  };

  return (
    // <Tooltip title={<NestSensorTooltipContent sensor={sensor} />}>
    <Chip
      label={sensor.device_name}
      className={styles.chip}
      icon={<CheckIcon style={chipStyles} />}
      onClick={handleClick}
    />
    // </Tooltip>
  );
};

const NestSensorList = () => {
  const sensors = useSelector((x) => x.nest.sensors) ?? [];

  return (
    <Paper
      elevation={1}
      className={styles.nestDashboardSensorBackground}>
      <Grid container spacing={3}>
        {sensors.map((sensor) => (
          <Grid item lg={12}>
            <NestSensorChip key={sensor.device_id} sensor={sensor} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const NestSensorContent = () => {
  const { selectedSensor = {} } = useSelector((x) => x.nest);

  return (
    <Grid container spacing={2}>
      <Grid item lg={12}>
        <Typography>
          <b>Name:</b> {selectedSensor?.device_name}
        </Typography>
      </Grid>
      <Grid item lg={12}>
        <Typography>
          <b>ID:</b> {selectedSensor?.device_id}
        </Typography>
      </Grid>
      <Grid item lg={12}>
        <Typography>
          <b>Health Status: </b>
          {selectedSensor?.health?.status}
        </Typography>
      </Grid>
      <Grid item lg={12}>
        <Typography>
          <b>Last contact: </b>
          {selectedSensor &&
            getFormattedLastContactDate(
              selectedSensor?.health?.last_contact
            )}
        </Typography>
      </Grid>
      <Grid item lg={12}>
        <Typography>
          <b>Seconds since last contact: </b>
          {selectedSensor?.health?.seconds_elapsed}
        </Typography>
      </Grid>
      <Grid item lg={12}>
        <Typography>
          <b>Degrees (F) </b>
          {selectedSensor?.data?.degrees_fahrenheit}
        </Typography>
      </Grid>
      <Grid item lg={12}>
        <Typography>
          <b>Humidity (%) </b>
          {selectedSensor?.data?.humidity_percent}
        </Typography>
      </Grid>
    </Grid>
  );
};

const displayInline = {
  display: 'inline',
  margin: 'auto',
};

const DashboardNestLayout = () => {
  const dispatch = useDispatch();

  const { sensorsLoading } = useSelector((x) => x.nest);

  const handleRefreshClick = () => {
    dispatch(getSensorInfo());
  };

  useEffect(() => {
    dispatch(getThermostatInfo());
    dispatch(getSensorInfo());
  }, []);

  return sensorsLoading ? (
    <Spinner />
  ) : (
    <div>
      <span className={styles.nextLayoutDisplayInline}>
        <h1 className={styles.nextLayoutDisplayInline}>Sensors</h1>
        <Button
          className={styles.nestRefreshButton}
          onClick={handleRefreshClick}>
          Refresh
        </Button>
      </span>
      <Grid container spacing={3}>
        <Grid item lg={3}>
          <NestSensorList />
        </Grid>
        <Grid item lg={9}>
          <NestSensorContent />
        </Grid>
      </Grid>
    </div>
  );
};

export { DashboardNestLayout };
