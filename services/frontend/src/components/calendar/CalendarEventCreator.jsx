// services/frontend/src/components/calendar/CalendarEventCreator.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Send, Refresh } from '@mui/icons-material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCalendarEvent } from '../../store/calendar/calendarActions';
import { setPrompt } from '../../store/calendar/calendarSlice';

const CalendarEventCreator = () => {
  const dispatch = useDispatch();
  const { prompt, isGenerating } = useSelector((x) => x.calendar);

  const [localPrompt, setLocalPrompt] = useState(prompt || '');

  const handlePromptChange = (event) => {
    setLocalPrompt(event.target.value);
  };

  const handleGenerate = () => {
    dispatch(setPrompt(localPrompt));
    dispatch(generateCalendarEvent(localPrompt));
  };

  const handleRetry = () => {
    if (prompt) {
      dispatch(generateCalendarEvent(prompt));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleGenerate();
    }
  };
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom color='primary'>
          Create Calendar Event
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mb: 2 }}>
          Describe your event in natural language and we'll generate a
          calendar entry for you.
        </Typography>

        <Grid container spacing={2} alignItems='flex-end'>
          <Grid item xs={12} md={10}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label='Event Description'
              placeholder="e.g., 'Meeting with John tomorrow at 2 PM in the conference room to discuss project updates'"
              value={localPrompt}
              onChange={handlePromptChange}
              onKeyPress={handleKeyPress}
              disabled={isGenerating}
              variant='outlined'
              helperText='Press Ctrl+Enter to generate'
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Box
              display='flex'
              gap={1}
              flexDirection={{ xs: 'row', md: 'column' }}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleGenerate}
                disabled={!localPrompt.trim() || isGenerating}
                startIcon={
                  isGenerating ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Send />
                  )
                }
                fullWidth>
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
              {prompt && (
                <Button
                  variant='outlined'
                  onClick={handleRetry}
                  disabled={isGenerating}
                  startIcon={<Refresh />}
                  fullWidth>
                  Retry
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { CalendarEventCreator };
