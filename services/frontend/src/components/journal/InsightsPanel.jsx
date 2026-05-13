import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { AutoAwesome, Refresh } from '@mui/icons-material';
import { MoodTrend } from './MoodTrend';
import { MoodDot } from './MoodDot';
import { formatDayLabel } from './journalGrouping';
import { INSIGHTS_DAYS_OPTIONS } from './journalConstants';
import { setInsightsDaysBack } from '../../store/journal/journalSlice';
import { journalActions } from '../../store/journal/journalActions';

/**
 * The Insights tab — AI summary, mood trend, streak, themes, and
 * recent moods.  Pulls all state from Redux.
 */
function InsightsPanel() {
  const dispatch = useDispatch();
  const insights = useSelector((s) => s.journal.insights);
  const loading = useSelector((s) => s.journal.insightsLoading);
  const error = useSelector((s) => s.journal.insightsError);
  const daysBack = useSelector((s) => s.journal.ui.insightsDaysBack);

  const summary = insights?.summary;
  const moodTrend = insights?.mood_trend;
  const streak = insights?.streak;
  const themes = insights?.themes?.themes || [];
  const recentMoods = insights?.recent_moods?.moods || [];
  const generatedAt = insights?.generated_at;

  const handleDaysBackChange = (value) => {
    dispatch(setInsightsDaysBack(value));
    dispatch(journalActions.loadInsights(value));
  };

  return (
    <Stack spacing={2}>
      <Card variant='outlined'>
        <CardContent>
          <Stack
            direction='row'
            alignItems='center'
            spacing={1}
            mb={2}
            justifyContent='space-between'>
            <Stack direction='row' alignItems='center' spacing={1}>
              <AutoAwesome color='primary' fontSize='small' />
              <Typography
                variant='overline'
                color='text.secondary'
                fontWeight={700}>
                AI Summary
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1}>
              <Select
                size='small'
                value={daysBack}
                onChange={(e) => handleDaysBackChange(e.target.value)}
                sx={{ minWidth: 140 }}>
                {INSIGHTS_DAYS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              <IconButton
                aria-label='Refresh insights'
                size='small'
                onClick={() =>
                  dispatch(journalActions.loadInsights(daysBack))
                }
                disabled={loading}
                title='Refresh insights'>
                <Refresh fontSize='small' />
              </IconButton>
            </Stack>
          </Stack>

          {loading && !insights && (
            <Stack alignItems='center' py={2}>
              <CircularProgress size={20} />
            </Stack>
          )}

          {error && (
            <Typography variant='body2' color='error'>
              {error}
            </Typography>
          )}

          {summary?.bullets && summary.bullets.length > 0 ? (
            <Box component='ul' sx={{ pl: 2.5, mt: 0, mb: 2 }}>
              {summary.bullets.map((bullet, index) => (
                <li key={index}>
                  <Typography variant='body2'>{bullet}</Typography>
                </li>
              ))}
            </Box>
          ) : (
            !loading &&
            !error && (
              <Typography variant='body2' color='text.secondary'>
                Not enough processed entries yet.
              </Typography>
            )
          )}

          {generatedAt && (
            <Typography variant='caption' color='text.secondary'>
              Generated {new Date(generatedAt).toLocaleString()}
            </Typography>
          )}
        </CardContent>
      </Card>

      <MoodTrend points={moodTrend?.points || []} />

      <Card variant='outlined'>
        <CardContent>
          <Typography
            variant='overline'
            color='text.secondary'
            fontWeight={700}>
            Streak
          </Typography>

          <Stack
            direction='row'
            spacing={1}
            alignItems='baseline'
            mt={1}>
            <Typography variant='h3'>
              {streak?.current_days ?? 0}
            </Typography>
            <Typography color='text.secondary'>
              {(streak?.current_days ?? 0) === 1
                ? 'day in a row'
                : 'days in a row'}
            </Typography>
          </Stack>

          {typeof streak?.longest_days === 'number' && (
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ mt: 1, display: 'block' }}>
              Best: {streak.longest_days} day
              {streak.longest_days === 1 ? '' : 's'}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card variant='outlined'>
        <CardContent>
          <Typography
            variant='overline'
            color='text.secondary'
            fontWeight={700}>
            Recurring themes
          </Typography>

          {themes.length === 0 ? (
            <Typography variant='body2' color='text.secondary' mt={2}>
              No themes yet
            </Typography>
          ) : (
            <Stack direction='row' flexWrap='wrap' gap={1} mt={2}>
              {themes.map((theme) => (
                <Chip
                  key={theme.label}
                  size='small'
                  label={
                    theme.count > 1
                      ? `${theme.label} · ${theme.count}`
                      : theme.label
                  }
                  variant='outlined'
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card variant='outlined'>
        <CardContent>
          <Typography
            variant='overline'
            color='text.secondary'
            fontWeight={700}>
            Recent moods
          </Typography>

          {recentMoods.length === 0 ? (
            <Typography variant='body2' color='text.secondary' mt={2}>
              No mood data yet
            </Typography>
          ) : (
            <Stack spacing={1.5} mt={2}>
              {recentMoods.map((mood) => (
                <Stack
                  key={mood.entry_id || mood.date}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'>
                  <Typography variant='body2' color='text.secondary'>
                    {formatDayLabel(mood.date)}
                  </Typography>
                  {mood.score !== undefined && (
                    <MoodDot score={mood.score} />
                  )}
                </Stack>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

export { InsightsPanel };
