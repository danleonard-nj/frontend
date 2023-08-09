import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  hvacStatusNameMapping,
  nestCommandKeys,
  thermostatConnectivityMapping,
  thermostatModeNameMapping,
} from '../../api/data/nest';
import {
  getFormattedCommandName,
  getFormattedFahrenheit,
  getFormattedPercent,
  getMappedNameOrDefault,
} from '../../api/helpers/nestHelpers';
import {
  getThermostat,
  getThermostatCommands,
  sendThermostatCommand,
} from '../../store/nest/nestActions';
import Spinner from '../Spinner';
import { NestThermostatCardRow } from './NestThermostatCardRow';
import { NestThermostatCommandList } from './NestThermostatCommandList';
import {
  NestThermostatSetCool,
  NestThermostatSetHeat,
  NestThermostatSetRange,
} from './NestThermostatSetRange';
import { ConnectionStatusIcon } from './icons/ConnectionStatusIcon';
import { HvacStatusIcon } from './icons/HvacStatusIcon';
import { ModeStatusIcon } from './icons/ModeStatusIcon';

const iconStyle = {
  marginRight: '0.5rem',
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
          <NestThermostatCardRow
            label='Name'
            value={thermostat?.thermostat_name}
          />
          <SectionDivider />
          <NestThermostatCardRow
            label='HVAC Status'
            icon={<HvacStatusIcon status={thermostat?.hvac_status} />}
            value={getMappedNameOrDefault(
              thermostat?.hvac_status,
              hvacStatusNameMapping
            )}
          />
          <NestThermostatCardRow
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
          <NestThermostatCardRow
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
            <NestThermostatCardRow
              label='Cool'
              icon={<AcUnitIcon color='info' sx={iconStyle} />}
              value={getFormattedFahrenheit(
                thermostat?.cool_fahrenheit
              )}
            />
          )}
          {thermostat?.heat_fahrenheit != 0 && (
            <NestThermostatCardRow
              label='Heat'
              icon={
                <LocalFireDepartmentIcon
                  color='error'
                  sx={iconStyle}
                />
              }
              value={getFormattedFahrenheit(
                thermostat?.heat_fahrenheit
              )}
            />
          )}
          <SectionDivider />
          <NestThermostatCardRow
            label='Ambient Temperature'
            value={getFormattedFahrenheit(
              thermostat?.ambient_temperature_fahrenheit
            )}
          />
          <NestThermostatCardRow
            label='Ambient Humidity'
            value={getFormattedPercent(thermostat?.humidity_percent)}
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
      <Paper elevation={1} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item lg={12} xs={12}>
            <Typography variant='h6'>
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

  return (
    <Grid container spacing={3}>
      <Grid item lg={6} xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={12} xs={12}>
            {commandsLoading ? (
              <Spinner />
            ) : (
              <NestThermostatCommandList
                commands={commands}
                selectedCommand={selectedCommand}
                handleSelect={handleSelectCommand}
              />
            )}
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
