import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import React from 'react';

const formatHealthStatus = (health) => {
  return health === 'healthy' ? 'Healthy' : 'Unhealthy';
};

const formatLastContact = (lastContact) => {
  return new Date(lastContact * 1000).toLocaleString();
};

const formatSeconds = (seconds) => {
  return seconds > 1 ? `${seconds} seconds` : `${seconds} second`;
};

const formatTemp = (temp) => {
  return `${temp}°F`;
};

const formatPercent = (percent) => {
  return Number(percent / 100).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
  });
};

const HealthStatusIcon = ({ status }) => {
  return status === 'healthy' ? (
    <CheckCircleIcon color='success' />
  ) : (
    <CancelIcon color='error' />
  );
};

const SensorCardInfoLine = ({ label, value }) => {
  return (
    <>
      <Typography sx={{ fontSize: 12 }} color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='body2' gutterBottom>
        {value ?? ''}
      </Typography>
    </>
  );
};

const SensorInfoCard = ({ sensor, onViewClick }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {sensor?.device_name}{' '}
          <HealthStatusIcon status={sensor?.health?.status} />
        </Typography>
        {/* <SensorCardInfoLine
          label='Device ID'
          value={sensor?.device_id}
        /> */}
        <SensorCardInfoLine
          label='Degrees'
          value={formatTemp(sensor?.data?.degrees_fahrenheit ?? 0)}
        />
        <SensorCardInfoLine
          label='Humidity'
          value={formatPercent(sensor?.data?.humidity_percent ?? 0)}
        />
        <SensorCardInfoLine
          label='Health'
          value={formatHealthStatus(sensor?.health?.status)}
        />
        <SensorCardInfoLine
          label='Last Contact'
          value={formatLastContact(sensor?.health?.last_contact ?? 0)}
        />
        <SensorCardInfoLine
          label='Seconds Elapsed'
          value={formatSeconds(sensor?.health?.seconds_elapsed ?? 0)}
        />
      </CardContent>
      <CardActions>
        <Button size='small' onClick={onViewClick}>
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export { SensorInfoCard };
