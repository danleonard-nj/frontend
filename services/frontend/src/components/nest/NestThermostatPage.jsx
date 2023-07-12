import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
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
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SensorsIcon from '@mui/icons-material/Sensors';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';
import {
  hvacStatusNameMapping,
  nestCommandKeys,
  thermostatConnectivityMapping,
  thermostatModeNameMapping,
} from '../../api/data/nest';
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

const getMappedNameOrDefault = (key, map, defaultValue = null) => {
  if (key in map) {
    return map[key];
  }

  return defaultValue ?? key;
};

const iconStyle = {
  marginRight: '0.5rem',
};

const InfoLine = ({ label, value, icon = null }) => {
  if (icon != null && icon != undefined) {
    return (
      <Box sx={{ marginBottom: '0.5rem' }}>
        <Typography
          sx={{
            fontSize: 14,
            verticalAlign: 'middle',
          }}
          color='text.secondary'>
          {label}
        </Typography>
        <Typography variant='body2' gutterBottom m='auto'>
          <div style={{ display: 'flex' }}>
            {icon} {value ?? ''}
          </div>
        </Typography>
      </Box>
    );
  } else {
    return (
      <>
        {' '}
        <Typography
          sx={{ fontSize: 12 }}
          color='text.secondary'
          gutterBottom>
          {label}
        </Typography>
        <Typography variant='body2' gutterBottom>
          {value ?? ''}
        </Typography>
      </>
    );
  }
};

const HvacStatusIcon = ({ status }) => {
  switch (status) {
    case 'HEATING': {
      return <LocalFireDepartmentIcon color='error' sx={iconStyle} />;
    }
    case 'COOLING': {
      return <AcUnitIcon color='info' sx={iconStyle} />;
    }
    default: {
      return <PowerSettingsNewIcon color='disabled' sx={iconStyle} />;
    }
  }
};

const ConnectionStatusIcon = ({ status }) => {
  switch (status) {
    case 'ONLINE': {
      return <SensorsIcon color='success' sx={iconStyle} />;
    }
    case 'OFFLINE': {
      return <SensorsOffIcon color='error' sx={iconStyle} />;
    }
    default: {
      return <></>;
    }
  }
};

const ModeStatusIcon = ({ mode }) => {
  switch (mode) {
    case 'HEAT': {
      return <LocalFireDepartmentIcon color='error' sx={iconStyle} />;
    }
    case 'COOL': {
      return <AcUnitIcon color='info' sx={iconStyle} />;
    }
    default: {
      return <></>;
    }
  }
};

const CommandListButtonIcon = ({ command }) => {
  switch (command.command) {
    case 'SetHeat': {
      return <LocalFireDepartmentIcon color='error' sx={iconStyle} />;
    }
    case 'SetCool': {
      return <AcUnitIcon color='info' sx={iconStyle} />;
    }
    case 'SetPowerOff': {
      return <PowerSettingsNewIcon color='disabled' sx={iconStyle} />;
    }
    default: {
      return <SettingsIcon color='disabled' sx={iconStyle} />;
    }
  }
};

const SectionDivider = () => {
  return <Divider sx={{ margin: '1rem' }} />;
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
          <SectionDivider />
          <InfoLine
            label='HVAC Status'
            icon={<HvacStatusIcon status={thermostat?.hvac_status} />}
            value={getMappedNameOrDefault(
              thermostat?.hvac_status,
              hvacStatusNameMapping
            )}
          />
          <InfoLine
            label='Connectivity'
            icon={
              <ConnectionStatusIcon
                status={thermostat?.thermostat_status}
              />
            }
            value={getMappedNameOrDefault(
              thermostat?.thermostat_status,
              thermostatConnectivityMapping
            )}
          />
          <InfoLine
            label='Mode'
            icon={
              <ModeStatusIcon mode={thermostat?.thermostat_mode} />
            }
            value={getMappedNameOrDefault(
              thermostat?.thermostat_mode,
              thermostatModeNameMapping
            )}
          />
          <SectionDivider />
          {thermostat?.cool_fahrenheit != 0 && (
            <InfoLine
              label='Cool'
              icon={<AcUnitIcon color='info' sx={iconStyle} />}
              value={formatDegrees(thermostat?.cool_fahrenheit)}
            />
          )}
          {thermostat?.heat_fahrenheit != 0 && (
            <InfoLine
              label='Heat'
              icon={
                <LocalFireDepartmentIcon
                  color='error'
                  sx={iconStyle}
                />
              }
              value={formatDegrees(thermostat?.heat_fahrenheit)}
            />
          )}
          <SectionDivider />
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

  const CommandListItem = ({ command }) => {
    return (
      <ListItemButton
        selected={selectedCommand.command === command.command}
        onClick={() => handleSelectCommand(command)}>
        <ListItemIcon>
          <CommandListButtonIcon command={command} />
        </ListItemIcon>
        <ListItemText
          primary={getFormattedCommandName(command.command)}
        />
      </ListItemButton>
    );
  };

  const CommandList = () => {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant='h5'>Thermostat Commands</Typography>
        <List dense>
          {commands.map((command) => (
            <CommandListItem
              key={command.command}
              command={command}
            />
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
