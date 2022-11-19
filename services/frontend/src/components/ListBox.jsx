import {
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import React from 'react';
import DashboardTitle from './dashboard/DashboardTitle';

export default function ListBox({
  title,
  icon,
  items,
  onClick,
  toolbar,
  maxHeight,
}) {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid container spacing={3} sx={{ marginBottom: 1 }}>
        <Grid item lg={9}>
          <DashboardTitle>{title}</DashboardTitle>
        </Grid>
        <Grid item lg={3}>
          {toolbar && toolbar}
        </Grid>
      </Grid>
      <Paper elevation={3}>
        <List
          component='nav'
          sx={{
            maxHeight: maxHeight,
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}
        >
          {items?.length &&
            items.map((item) => (
              <ListItemButton key={item?.key} onClick={() => onClick(item)}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
        </List>
      </Paper>
    </Paper>
  );
}
