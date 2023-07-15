import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import React from 'react';

const NestSideNav = ({ selected, onChange }) => {
  return (
    <Paper elevation={3}>
      <nav aria-label='main mailbox folders'>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={selected === 'sensor-info'}
              onClick={() => onChange('sensor-info')}>
              <ListItemText primary='Sensor Info' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selected === 'weather'}
              onClick={() => onChange('weather')}>
              <ListItemText primary='Weather' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selected === 'thermostat'}
              onClick={() => onChange('thermostat')}>
              <ListItemText primary='Thermostat' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selected === 'configuration'}
              onClick={() => onChange('configuration')}>
              <ListItemText primary='Configuration' />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Paper>
  );
};

export { NestSideNav };
