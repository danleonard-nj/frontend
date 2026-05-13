import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { moodTone } from './moodUtils';

/**
 * Bar-chart of recent daily mood scores.
 */
function MoodTrend({ points }) {
  const safePoints = Array.isArray(points) ? points : [];
  const maxScore =
    safePoints.reduce(
      (max, p) => Math.max(max, Number(p.score) || 0),
      0,
    ) || 1;

  return (
    <Card variant='outlined'>
      <CardContent>
        <Typography
          variant='overline'
          color='text.secondary'
          fontWeight={700}>
          Mood trend
        </Typography>

        {safePoints.length === 0 ? (
          <Typography variant='body2' color='text.secondary' mt={2}>
            No mood data yet
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                height: 90,
                display: 'flex',
                alignItems: 'end',
                gap: 1,
                mt: 2,
              }}>
              {safePoints.map((point, index) => {
                const height = Math.max(
                  4,
                  ((Number(point.score) || 0) / maxScore) * 90,
                );
                const bgColor = moodTone(Number(point.score));
                return (
                  <Box
                    key={point.date || index}
                    title={`${point.date || ''} • ${point.label || 'unknown'}${
                      typeof point.score === 'number'
                        ? ` (${point.score})`
                        : ''
                    }`}
                    sx={{
                      flex: 1,
                      height,
                      borderRadius: 1,
                      bgcolor: bgColor,
                      opacity: 0.75,
                    }}
                  />
                );
              })}
            </Box>

            <Stack
              direction='row'
              justifyContent='space-between'
              mt={1}>
              <Typography variant='caption' color='text.secondary'>
                {safePoints.length} day
                {safePoints.length === 1 ? '' : 's'}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                today
              </Typography>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { MoodTrend };
