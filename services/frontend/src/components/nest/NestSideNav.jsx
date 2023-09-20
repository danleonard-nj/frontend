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
    <Paper elevation={1}>
      <nav>
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
              selected={selected === 'device-history'}
              onClick={() => onChange('device-history')}>
              <ListItemText primary='Device History' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selected === 'integrations'}
              onClick={() => onChange('integrations')}>
              <ListItemText primary='Integration Events' />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Paper>
  );
};

export { NestSideNav };
