// services/frontend/src/components/layouts/DashboardCalendarLayout.jsx
import { Alert, Box, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardTitle from '../dashboard/DashboardTitle';
import { CalendarEventCreator } from '../calendar/CalendarEventCreator';
import { CalendarEventEditor } from '../calendar/CalendarEventEditor';
import { clearError } from '../../store/calendar/calendarSlice';

const DashboardCalendarLayout = () => {
  const dispatch = useDispatch();
  const { generatedEvent, error, lastSavedEvent } = useSelector(
    (x) => x.calendar
  );

  useEffect(() => {
    // Clear any existing errors when component mounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <Box>
      <DashboardTitle gutterBottom>
        Calendar Event Creator
      </DashboardTitle>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CalendarEventCreator />
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert
              severity='error'
              onClose={() => dispatch(clearError())}
              sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Grid>
        )}

        {lastSavedEvent && (
          <Grid item xs={12}>
            <Alert severity='success' sx={{ mb: 2 }}>
              Event "{lastSavedEvent.summary}" saved successfully!
            </Alert>
          </Grid>
        )}

        {generatedEvent && (
          <Grid item xs={12}>
            <CalendarEventEditor />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export { DashboardCalendarLayout };
