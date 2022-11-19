import { TabPanel } from '@mui/lab';
import {
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getReminders } from '../../store/reminders/reminderActions';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { scrollable } from '../../api/helpers/formattingHelpers';
import ReminderList from '../reminders/ReminderList';
import ReminderTab from '../reminders/ReminderTab';

export default function LocationTab() {
  return <h1>Locations</h1>;
}
