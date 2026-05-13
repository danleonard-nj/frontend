import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { MoodDot } from './MoodDot';

/**
 * Building blocks for `JournalAnalysisCard`. Each helper renders a
 * single section of the analysis payload and returns null when the
 * underlying data is empty so callers can compose them freely.
 */

const bulletListSx = { pl: 2.5, mt: 1, mb: 0 };

export function SectionLabel({ children }) {
  return (
    <Typography
      variant='overline'
      color='text.secondary'
      fontWeight={700}>
      {children}
    </Typography>
  );
}

/**
 * Render an array as an unordered list of body2 typography items.
 * Optionally cap the number of items rendered.
 */
export function BulletList({ label, items, limit }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const visible =
    typeof limit === 'number' ? items.slice(0, limit) : items;
  return (
    <Box>
      {label && <SectionLabel>{label}</SectionLabel>}
      <Box component='ul' sx={bulletListSx}>
        {visible.map((item, index) => (
          <li key={index}>
            <Typography variant='body2'>{item}</Typography>
          </li>
        ))}
      </Box>
    </Box>
  );
}

/**
 * Render an array as a horizontal wrap of MUI Chips.
 */
export function ChipList({
  label,
  items,
  color,
  variant = 'outlined',
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <Box>
      <SectionLabel>{label}</SectionLabel>
      <Stack direction='row' flexWrap='wrap' gap={1} mt={1}>
        {items.map((item, index) => (
          <Chip
            key={`${item}-${index}`}
            size='small'
            label={item}
            variant={variant}
            color={color}
          />
        ))}
      </Stack>
    </Box>
  );
}

export function MoodSection({ mood }) {
  if (!mood) return null;
  const { score, label, confidence } = mood;
  return (
    <Box>
      <SectionLabel>Mood</SectionLabel>
      <Stack direction='row' spacing={1} alignItems='center' mt={1}>
        <MoodDot score={score} />
        <Typography variant='body2'>
          {label || 'unknown'}
          {typeof score === 'number' && ` • score ${score}`}
          {typeof confidence === 'number' &&
            ` • ${Math.round(confidence * 100)}% confidence`}
        </Typography>
      </Stack>
    </Box>
  );
}

export function RiskFlags({ flags }) {
  if (!flags || (!flags.crisis_language && !flags.medical_concern)) {
    return null;
  }
  return (
    <Box>
      <SectionLabel>Risk flags</SectionLabel>
      <Stack direction='row' flexWrap='wrap' gap={1} mt={1}>
        {flags.crisis_language && (
          <Chip
            size='small'
            icon={<Warning />}
            label='Crisis language'
            color='error'
          />
        )}
        {flags.medical_concern && (
          <Chip
            size='small'
            icon={<Warning />}
            label='Medical concern'
            color='warning'
          />
        )}
      </Stack>
    </Box>
  );
}

/**
 * Render leftover analysis fields the card doesn't know about as a
 * simple key/value list, keeping forward compatibility with new
 * backend fields.
 */
export function ExtraFields({ entries }) {
  if (!entries || entries.length === 0) return null;
  return (
    <Stack spacing={0.5}>
      {entries.map(([key, value]) => (
        <Typography key={key} variant='body2' color='text.secondary'>
          <strong>{key}:</strong>{' '}
          {typeof value === 'object'
            ? JSON.stringify(value)
            : String(value)}
        </Typography>
      ))}
    </Stack>
  );
}
