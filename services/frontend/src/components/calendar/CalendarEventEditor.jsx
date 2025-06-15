// services/frontend/src/components/calendar/CalendarEventEditor.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import {
  Event,
  LocationOn,
  AccessTime,
  Description,
  People,
  Save,
  Notifications,
} from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveCalendarEvent } from '../../store/calendar/calendarActions';
import { setGeneratedEvent } from '../../store/calendar/calendarSlice';

const CalendarEventEditor = () => {
  const dispatch = useDispatch();
  const { generatedEvent, isSaving } = useSelector((x) => x.calendar);

  const [editableEvent, setEditableEvent] = useState(null);

  // Debug logging
  console.log(
    'CalendarEventEditor - generatedEvent:',
    generatedEvent
  );
  console.log('CalendarEventEditor - editableEvent:', editableEvent);

  useEffect(() => {
    console.log(
      'CalendarEventEditor useEffect - generatedEvent changed:',
      generatedEvent
    );
    if (generatedEvent) {
      setEditableEvent({ ...generatedEvent });
    }
  }, [generatedEvent]);

  const handleFieldChange = (field, value) => {
    setEditableEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartTimeChange = (dateTime) => {
    setEditableEvent((prev) => ({
      ...prev,
      start: {
        ...prev.start,
        dateTime,
      },
    }));
  };

  const handleEndTimeChange = (dateTime) => {
    setEditableEvent((prev) => ({
      ...prev,
      end: {
        ...prev.end,
        dateTime,
      },
    }));
  };

  const handleSave = () => {
    dispatch(saveCalendarEvent(editableEvent));
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  if (!editableEvent) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box display='flex' alignItems='center' gap={1} mb={2}>
          <Event color='primary' />
          <Typography variant='h6' color='primary'>
            Event Details
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Event Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Event Title'
              value={editableEvent.summary || ''}
              onChange={(e) =>
                handleFieldChange('summary', e.target.value)
              }
              variant='outlined'
            />
          </Grid>

          {/* Date and Time */}
          <Grid item xs={12} md={6}>
            <Box display='flex' alignItems='center' gap={1} mb={1}>
              <AccessTime color='action' />
              <Typography variant='subtitle2'>Start Time</Typography>
            </Box>
            <TextField
              fullWidth
              type='datetime-local'
              value={
                editableEvent.start?.dateTime?.slice(0, 16) || ''
              }
              onChange={(e) =>
                handleStartTimeChange(e.target.value + ':00-04:00')
              }
              variant='outlined'
              size='small'
            />
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ mt: 1, display: 'block' }}>
              {editableEvent.start?.dateTime &&
                formatDateTime(editableEvent.start.dateTime)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display='flex' alignItems='center' gap={1} mb={1}>
              <AccessTime color='action' />
              <Typography variant='subtitle2'>End Time</Typography>
            </Box>
            <TextField
              fullWidth
              type='datetime-local'
              value={editableEvent.end?.dateTime?.slice(0, 16) || ''}
              onChange={(e) =>
                handleEndTimeChange(e.target.value + ':00-04:00')
              }
              variant='outlined'
              size='small'
            />
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ mt: 1, display: 'block' }}>
              {editableEvent.end?.dateTime &&
                formatDateTime(editableEvent.end.dateTime)}
            </Typography>
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' gap={1} mb={1}>
              <LocationOn color='action' />
              <Typography variant='subtitle2'>Location</Typography>
            </Box>
            <TextField
              fullWidth
              label='Event Location'
              value={editableEvent.location || ''}
              onChange={(e) =>
                handleFieldChange('location', e.target.value)
              }
              variant='outlined'
              size='small'
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' gap={1} mb={1}>
              <Description color='action' />
              <Typography variant='subtitle2'>Description</Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              label='Event Description'
              value={editableEvent.description || ''}
              onChange={(e) =>
                handleFieldChange('description', e.target.value)
              }
              variant='outlined'
              size='small'
            />
          </Grid>

          {/* Attendees */}
          {editableEvent.attendees &&
            editableEvent.attendees.length > 0 && (
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  gap={1}
                  mb={1}>
                  <People color='action' />
                  <Typography variant='subtitle2'>
                    Attendees
                  </Typography>
                </Box>
                <Box display='flex' gap={1} flexWrap='wrap'>
                  {editableEvent.attendees.map((attendee, index) => (
                    <Chip
                      key={index}
                      label={attendee.displayName || attendee.email}
                      variant='outlined'
                      size='small'
                    />
                  ))}
                </Box>
              </Grid>
            )}

          {/* Reminders */}
          {editableEvent.reminders?.overrides &&
            editableEvent.reminders.overrides.length > 0 && (
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  gap={1}
                  mb={1}>
                  <Notifications color='action' />
                  <Typography variant='subtitle2'>
                    Reminders
                  </Typography>
                </Box>
                <Box display='flex' gap={1} flexWrap='wrap'>
                  {editableEvent.reminders.overrides.map(
                    (reminder, index) => (
                      <Chip
                        key={index}
                        label={`${reminder.minutes} min before`}
                        variant='outlined'
                        size='small'
                        color='secondary'
                      />
                    )
                  )}
                </Box>
              </Grid>
            )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Button
              variant='contained'
              color='primary'
              size='large'
              onClick={handleSave}
              disabled={isSaving || !editableEvent.summary}
              startIcon={
                isSaving ? <CircularProgress size={20} /> : <Save />
              }
              sx={{ minWidth: 120 }}>
              {isSaving ? 'Saving...' : 'Save Event'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { CalendarEventEditor };
