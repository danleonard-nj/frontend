import SettingsIcon from '@mui/icons-material/Settings';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nestCommandKeys } from '../../api/data/nest';
import { getFormattedCommandName } from '../../api/helpers/nestHelpers';
import {
  getThermostat,
  getThermostatCommands,
  sendThermostatCommand,
} from '../../store/nest/nestActions';
import Spinner from '../Spinner';
import {
  NestThermostatSetCool,
  NestThermostatSetHeat,
  NestThermostatSetRange,
} from './NestThermostatSetRange';

const formatDegrees = (degrees) => {
  return degrees ? `${degrees}°F` : degrees;
};

const formatPercent = (percent) => {
  return percent ? `${percent}%` : percent;
};

const InfoLine = ({ label, value }) => {
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

const NestThermostatPage = () => {
  const dispatch = useDispatch();

  const {
    thermostat = false,
    thermostatLoading = false,
    commands = [],
    commandLoading = false,
    commandsLoading = false,
  } = useSelector((x) => x.nest);

  const [selectedCommand, setSelectedCommand] = useState({
    command: 'SetRange',
    key: nestCommandKeys.setRange,
  });

  const handleSelectCommand = (command) => {
    setSelectedCommand(command);
  };

  const handleRefresh = () => {
    dispatch(getThermostat());
  };

  const handleSendCommand = (command) => {
    dispatch(sendThermostatCommand(command));
  };

  useEffect(() => {
    dispatch(getThermostat());
  }, [dispatch]);

  useEffect(() => {
    if (!commands?.length) {
      dispatch(getThermostatCommands());
    }
  }, []);

  const ThermostatCard = () => {
    return (
      <Card>
        <CardContent>
          <InfoLine
            label='Name'
            value={thermostat?.thermostat_name}
          />
          <InfoLine
            label='HVAC Status'
            value={thermostat?.hvac_status}
          />
          <InfoLine
            label='Connectivity'
            value={thermostat?.thermostat_status}
          />
          <InfoLine
            label='Mode'
            value={thermostat?.thermostat_mode}
          />
          <InfoLine
            label='Cool'
            value={formatDegrees(thermostat?.cool_fahrenheit)}
          />
          <InfoLine
            label='Heat'
            value={formatDegrees(thermostat?.heat_fahrenheit)}
          />
          <InfoLine
            label='Ambient Temperature'
            value={formatDegrees(
              thermostat?.ambient_temperature_fahrenheit
            )}
          />
          <InfoLine
            label='Ambient Humidity'
            value={formatPercent(thermostat?.humidity_percent)}
          />
        </CardContent>
        <CardActions>
          <Button size='small' onClick={handleRefresh}>
            Refresh
          </Button>
        </CardActions>
      </Card>
    );
  };

  const CommandPanel = () => {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item lg={12} xs={12}>
            <Typography variant='h5'>
              {selectedCommand &&
                getFormattedCommandName(selectedCommand.command)}
            </Typography>
          </Grid>
          <Grid item lg={12} xs={12}>
            {selectedCommand?.key === nestCommandKeys.setRange &&
              !commandsLoading && <NestThermostatSetRange />}
            {selectedCommand?.key === nestCommandKeys.setCool &&
              !commandsLoading && <NestThermostatSetCool />}
            {selectedCommand?.key === nestCommandKeys.setHeat &&
              !commandsLoading && <NestThermostatSetHeat />}
          </Grid>
          <Grid item lg={12} xs={12}>
            <Button
              variant='contained'
              onClick={() => handleSendCommand(selectedCommand?.key)}
              disabled={commandLoading}>
              Send Command
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const CommandList = () => {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant='h5'>Thermostat Commands</Typography>
        <List dense>
          {commands.map((command) => (
            <ListItemButton
              selected={selectedCommand.command === command.command}
              onClick={() => handleSelectCommand(command)}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary={getFormattedCommandName(command.command)}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={6} xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={12} xs={12}>
            {commandsLoading ? <Spinner /> : <CommandList />}
          </Grid>
          <Grid item lg={12} xs={12}>
            {!commandsLoading && <CommandPanel />}
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={6} xs={12}>
        <Paper elevation={3}>
          {thermostatLoading ? <Spinner /> : <ThermostatCard />}
        </Paper>
      </Grid>
      <Grid item lg={6} xs={12}></Grid>
    </Grid>
  );
};

export { NestThermostatPage };
