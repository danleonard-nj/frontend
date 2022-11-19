import { Grid, Paper, Tab, Tabs } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getReminders,
  getTimezones,
} from '../../store/reminders/reminderActions';
import { ReminderGridWrapper } from '../reminders/reminders/ReminderGridWrapper';
import { LocationGridWrapper } from '../reminders/locations/LocationGridWrapper';
import { NotificationGridComponent as NotificationGridWrapper } from '../reminders/notifications/NotificationGridWrapper';

export default function DashboardRemindersLayout() {
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, value) => {
    setTabValue(value);
  };

  useEffect(() => {
    dispatch(getReminders());
    dispatch(getTimezones());
  }, []);

  return (
    <Grid container spacing={2} id='grid-reminders-container-main'>
      <Grid item id='grid-reminders-tab-list-item'>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label='basic tabs example'>
          <Tab label='Reminders' />
          <Tab label='Locations' />
          <Tab label='Notifications' />
        </Tabs>
      </Grid>
      <Grid item lg={12} xs={12} md={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 500,
          }}>
          {tabValue == 0 && <ReminderGridWrapper />}
          {tabValue == 1 && <LocationGridWrapper />}
          {tabValue == 2 && <NotificationGridWrapper />}
        </Paper>
      </Grid>
    </Grid>
  );
}
