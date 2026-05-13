import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AutoFixHigh,
  Check,
  Close,
  ContentCopy,
  Edit,
  Tune,
  Undo,
} from '@mui/icons-material';
import { POLISH_OPTIONS } from './journalConstants';

/**
 * Read-only or editable transcript card with commit, polish, and undo
 * affordances.  Pure presentational — all state changes happen via
 * the handler props.
 */
function TranscriptCard({
  transcript,
  committed,
  committing,
  onCommit,
  recordedAt,
  isEditable,
  onEdit,
  onUndo,
  canUndo,
  onPolish,
  onUndoPolish,
  canUndoPolish,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [polishAnchor, setPolishAnchor] = useState(null);
  const [polishing, setPolishing] = useState(false);
  const polishOpen = Boolean(polishAnchor);

  const wordCount = useMemo(
    () =>
      transcript
        ? transcript.trim().split(/\s+/).filter(Boolean).length
        : 0,
    [transcript],
  );

  const paragraphs = useMemo(
    () =>
      transcript
        ? transcript
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean)
        : [],
    [transcript],
  );

  const handleCopy = async () => {
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript);
    } catch {
      // ignore
    }
  };

  const recordedLabel = recordedAt
    ? new Date(recordedAt).toLocaleString()
    : null;

  return (
    <Card variant='outlined' sx={{ flex: 1 }}>
      <CardContent>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={3}>
          <Chip
            size='small'
            color='primary'
            label='Auto-transcribed'
          />
          <Stack direction='row' spacing={1}>
            <IconButton
              aria-label='Copy transcript'
              size='small'
              onClick={handleCopy}
              disabled={!transcript || isEditing}>
              <ContentCopy fontSize='small' />
            </IconButton>
            {canUndo && (
              <Tooltip title='Undo last clip'>
                <IconButton size='small' onClick={onUndo}>
                  <Undo fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
            {isEditable && (
              <Tooltip
                title={isEditing ? 'Cancel edit' : 'Edit transcript'}>
                <IconButton
                  size='small'
                  onClick={
                    isEditing
                      ? () => setIsEditing(false)
                      : () => {
                          setEditValue(transcript);
                          setIsEditing(true);
                        }
                  }>
                  {isEditing ? (
                    <Close fontSize='small' />
                  ) : (
                    <Edit fontSize='small' />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {typeof onPolish === 'function' && (
              <Tooltip title='Polish with AI'>
                <span>
                  <IconButton
                    size='small'
                    disabled={!transcript || polishing || isEditing}
                    onClick={(e) => setPolishAnchor(e.currentTarget)}>
                    {polishing ? (
                      <CircularProgress size={16} />
                    ) : (
                      <AutoFixHigh fontSize='small' />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {canUndoPolish && typeof onUndoPolish === 'function' && (
              <Tooltip title='Undo polish'>
                <IconButton
                  size='small'
                  onClick={async () => {
                    setPolishing(true);
                    try {
                      await onUndoPolish();
                    } finally {
                      setPolishing(false);
                    }
                  }}
                  disabled={polishing}>
                  <Undo fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
            <IconButton aria-label='Transcript options' size='small'>
              <Tune fontSize='small' />
            </IconButton>
          </Stack>
        </Stack>

        <Menu
          anchorEl={polishAnchor}
          open={polishOpen}
          onClose={() => setPolishAnchor(null)}>
          {POLISH_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.mode}
              onClick={async () => {
                setPolishAnchor(null);
                setPolishing(true);
                try {
                  await onPolish([opt.mode]);
                } finally {
                  setPolishing(false);
                }
              }}>
              {opt.label}
            </MenuItem>
          ))}
        </Menu>

        {isEditing ? (
          <TextField
            multiline
            fullWidth
            minRows={4}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : paragraphs.length > 0 ? (
          <Stack spacing={2.5}>
            {paragraphs.map((paragraph, index) => (
              <Typography key={index}>{paragraph}</Typography>
            ))}
          </Stack>
        ) : (
          <Typography color='text.secondary'>
            Record a clip to start your entry. Each segment is
            appended here as it is transcribed.
          </Typography>
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mt={4}>
          <Typography variant='caption' color='text.secondary'>
            {recordedLabel ? `${recordedLabel} • ` : ''}
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </Typography>

          {isEditing ? (
            <Button
              variant='contained'
              onClick={() => {
                if (typeof onEdit === 'function') onEdit(editValue);
                setIsEditing(false);
              }}>
              Save
            </Button>
          ) : (
            <Button
              variant='contained'
              startIcon={<Check />}
              onClick={onCommit}
              disabled={committed || committing || !transcript}>
              {committing ? 'Committing…' : 'Commit entry'}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export { TranscriptCard };
