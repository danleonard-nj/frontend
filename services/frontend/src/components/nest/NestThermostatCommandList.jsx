import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React from 'react';
import { CommandListButtonIcon } from './icons/CommandListButtonIcon';
import { getFormattedCommandName } from '../../api/helpers/nestHelpers';

const NestThermostatCommandListItem = ({
  command,
  selected,
  onClick,
}) => {
  return (
    <ListItemButton selected={selected} onClick={onClick}>
      <ListItemIcon>
        <CommandListButtonIcon command={command} />
      </ListItemIcon>
      <ListItemText
        primary={getFormattedCommandName(command.command)}
      />
    </ListItemButton>
  );
};

const NestThermostatCommandList = ({
  commands,
  selectedCommand,
  handleSelect,
}) => {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant='h6'>Commands</Typography>
      <List dense>
        {commands.map((command) => (
          <NestThermostatCommandListItem
            key={command.command}
            command={command}
            selected={selectedCommand.command === command.command}
            onClick={() => handleSelect(command)}
          />
        ))}
      </List>
    </Paper>
  );
};

export { NestThermostatCommandList };
