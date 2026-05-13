import React from 'react';
import { Box } from '@mui/material';
import { moodTone } from './moodUtils';
/**
 * Mood indicator dot component
 * @param {number} score - The mood score (0-10)
 * @returns {JSX.Element}
 */
export function MoodDot({ score }) {
  return (
    <Box
      component='span'
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: moodTone(score),
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
}
