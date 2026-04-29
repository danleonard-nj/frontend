<<<<<<< HEAD
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add,
  AutoFixHigh,
  Check,
  Close,
  ContentCopy,
  DeleteOutline,
  Edit,
  ExpandLess,
  ExpandMore,
  FiberManualRecord,
  GraphicEq,
  Refresh,
  Search,
  Settings,
  Tune,
  Undo,
  AutoAwesome,
  MenuBook,
} from '@mui/icons-material';
<<<<<<< HEAD
import JournalRecorder from '../journal/JournalRecorder';
import JournalAnalysisCard from '../journal/JournalAnalysisCard';
import { journalActions } from '../../store/journal/journalActions';
import { setCommitError } from '../../store/journal/journalSlice';

// ─── MoodDot ──────────────────────────────────────────────────────────────────

function MoodDot({ mood = 'neutral' }) {
  const color =
    mood === 'good'
      ? 'success.main'
      : mood === 'low'
        ? 'warning.main'
        : 'text.disabled';

  return (
    <Box
      component='span'
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: color,
        display: 'inline-block',
        mr: 1,
        flexShrink: 0,
      }}
    />
  );
}

// ─── bucketEntries ────────────────────────────────────────────────────────────

/**
 * Groups entries into labelled buckets for the tree-view sidebar.
 * During search, returns a single flat "Results" group.
 */
function bucketEntries(entries, searchValue) {
  const normalizedSearch = searchValue.trim().toLowerCase();

  if (normalizedSearch) {
    const results = entries.filter((e) => {
      const haystack = `${e.date} ${e.title} ${e.time}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
    return results.length
      ? [{ label: 'Results', entries: results }]
      : [];
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const buckets = [
    { label: 'Today', maxDays: 1 },
    { label: 'Yesterday', maxDays: 2 },
    { label: 'This week', maxDays: 7 },
    { label: 'Last week', maxDays: 14 },
    { label: 'This month', maxDays: 30 },
    { label: 'Older', maxDays: Infinity },
  ];

  const groups = buckets.map((b) => ({
    label: b.label,
    entries: [],
  }));

  for (const entry of entries) {
    if (!entry.createdAt) {
      groups[groups.length - 1].entries.push(entry);
      continue;
    }
    const diffDays =
      (startOfToday - new Date(entry.createdAt)) /
      (1000 * 60 * 60 * 24);
    const idx = buckets.findIndex((b) => diffDays < b.maxDays);
    groups[idx >= 0 ? idx : groups.length - 1].entries.push(entry);
  }

  return groups.filter((g) => g.entries.length > 0);
}

// ─── GroupedEntryList ─────────────────────────────────────────────────────────

function GroupedEntryList({
  entries,
=======
function MiniWaveform({ bars = 34 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        height: 40,
        width: '100%',
        opacity: 0.9,
      }}>
      {Array.from({ length: bars }).map((_, index) => {
        const height = 8 + ((index * 17) % 26);

        return (
          <Box
            key={index}
            sx={{
              width: 3,
              height,
              borderRadius: 8,
              bgcolor: 'primary.main',
              opacity: index % 5 === 0 ? 0.45 : 0.9,
            }}
          />
        );
      })}
    </Box>
  );
}

function JournalSidebar({
>>>>>>> e032b66 (Feat: add Journal page layout and integrate with dashboard)
  searchValue,
  selectedEntry,
  onSelectEntry,
}) {
  const groups = useMemo(
    () => bucketEntries(entries, searchValue),
    [entries, searchValue],
  );
  const [collapsed, setCollapsed] = useState({});
  const toggle = (label) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

  if (groups.length === 0) {
    return (
      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ px: 1, py: 2 }}>
        No entries yet
      </Typography>
    );
  }

  return (
    <>
      {groups.map((group) => {
        const isOpen = !collapsed[group.label];
        return (
          <Box key={group.label} sx={{ mb: 1 }}>
            <Stack
              direction='row'
              alignItems='center'
              onClick={() => toggle(group.label)}
              sx={{
                px: 1,
                py: 0.5,
                cursor: 'pointer',
                userSelect: 'none',
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}>
              {isOpen ? (
                <ExpandLess
                  fontSize='small'
                  sx={{ mr: 0.5, color: 'text.secondary' }}
                />
              ) : (
                <ExpandMore
                  fontSize='small'
                  sx={{ mr: 0.5, color: 'text.secondary' }}
                />
              )}
              <Typography
                variant='overline'
                color='text.secondary'
                fontWeight={700}
                sx={{ lineHeight: 1.5 }}>
                {group.label}
              </Typography>
              <Typography
                variant='caption'
                color='text.disabled'
                sx={{ ml: 1 }}>
                {group.entries.length}
              </Typography>
            </Stack>

            <Collapse in={isOpen} unmountOnExit>
              <List disablePadding>
                {group.entries.map((entry) => {
                  const isSelected =
                    selectedEntry &&
                    (entry.id
                      ? entry.id === selectedEntry.id
                      : entry.title === selectedEntry.title);
                  return (
                    <ListItemButton
                      key={entry.id || `${entry.date}-${entry.title}`}
                      selected={isSelected}
                      onClick={() => onSelectEntry(entry)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        alignItems: 'flex-start',
                        borderLeft: 3,
                        borderColor: isSelected
                          ? 'primary.main'
                          : 'transparent',
                      }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            noWrap>
                            {entry.time}
                          </Typography>
                        }
                        secondary={
                          <Stack
                            direction='row'
                            alignItems='center'
                            mt={0.5}>
                            <MoodDot mood={entry.mood} />
                            <Typography
                              variant='body2'
                              color='text.primary'
                              fontWeight={600}
                              noWrap>
                              {entry.title}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          </Box>
        );
      })}
    </>
  );
}

// ─── JournalSidebar ───────────────────────────────────────────────────────────

function JournalSidebar({
  entries,
  searchValue,
  onSearchChange,
  selectedEntry,
  onSelectEntry,
  onNewEntry,
}) {
  return (
    <Card
      variant='outlined'
      sx={{
        height: '100%',
        minHeight: 720,
        bgcolor: 'background.paper',
      }}>
      <CardContent sx={{ p: 0, height: '100%' }}>
        <Stack sx={{ height: '100%' }}>
          <Box sx={{ p: 2.5, pb: 2 }}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              mb={3}>
              <Box>
                <Typography variant='h5' fontWeight={700}>
                  Journal
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  voice-first entries
                </Typography>
              </Box>
            </Stack>

            <TextField
              size='small'
              placeholder='Search entries'
              fullWidth
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search fontSize='small' />
                  </InputAdornment>
                ),
                endAdornment: searchValue ? (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      onClick={() => onSearchChange('')}>
                      <Close fontSize='small' />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>

          <Box sx={{ px: 1.5, pb: 1.5, flex: 1, overflowY: 'auto' }}>
            <GroupedEntryList
              entries={entries}
              searchValue={searchValue}
              selectedEntry={selectedEntry}
              onSelectEntry={onSelectEntry}
            />
          </Box>

          <Box
            sx={{
              p: 2.5,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}>
            <Button
              variant='outlined'
              startIcon={<Add />}
              fullWidth
<<<<<<< HEAD
              onClick={onNewEntry}
=======
>>>>>>> e032b66 (Feat: add Journal page layout and integrate with dashboard)
              sx={{ mb: 2 }}>
              New entry
            </Button>

            <Stack direction='row' justifyContent='space-between'>
              <IconButton>
                <Settings />
              </IconButton>
              <IconButton>
                <GraphicEq />
              </IconButton>
              <IconButton>
                <Tune />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── TranscriptCard ───────────────────────────────────────────────────────────

function TranscriptCard({
  transcript,
  committed,
  committing,
  onCommit,
  title,
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

=======
function RecorderCard() {
  return (
    <Card variant='outlined'>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction='row' spacing={3} alignItems='center'>
            <Box sx={{ textAlign: 'center', width: 96 }}>
              <IconButton
                size='large'
                sx={{
                  width: 64,
                  height: 64,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'error.main',
                  color: 'error.contrastText',
                  '&:hover': { bgcolor: 'error.dark' },
                }}>
                <Mic />
              </IconButton>
              <Typography variant='body2' mt={1}>
                Record
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                00:00
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <MiniWaveform bars={80} />
              <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                mt={1}>
                <MoodDot mood='good' />
                <Typography variant='caption' color='text.secondary'>
                  Ready to record
                </Typography>
              </Stack>
            </Box>

            <IconButton>
              <Tune />
            </IconButton>
          </Stack>

          <Divider />

          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='body2'>Saved clips</Typography>
            <Typography variant='body2' color='text.secondary'>
              3 clips
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}>
            {clips.map((clip, index) => (
              <Card
                key={index}
                variant='outlined'
                sx={{
                  flex: 1,
                  bgcolor: 'background.default',
                }}>
                <CardContent
                  sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack
                    direction='row'
                    spacing={1.5}
                    alignItems='center'>
                    <IconButton size='small'>
                      <PlayArrow fontSize='small' />
                    </IconButton>

                    <Box sx={{ flex: 1 }}>
                      <MiniWaveform bars={18} />
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant='caption' display='block'>
                        {clip.duration}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.secondary'>
                        {clip.time}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TranscriptCard({ committed, onCommit, title }) {
>>>>>>> e032b66 (Feat: add Journal page layout and integrate with dashboard)
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
<<<<<<< HEAD
            <IconButton
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
            <IconButton size='small'>
              <Tune fontSize='small' />
            </IconButton>
          </Stack>
        </Stack>

        <Menu
          anchorEl={polishAnchor}
          open={polishOpen}
          onClose={() => setPolishAnchor(null)}>
          {[
            { mode: 'grammar', label: 'Fix grammar' },
            { mode: 'organize', label: 'Organize' },
            { mode: 'concise', label: 'Make concise' },
            { mode: 'expand', label: 'Expand' },
            { mode: 'tone', label: 'Soften tone' },
          ].map((opt) => (
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
=======
        <Stack spacing={2.5}>
          <Typography>
            Woke up feeling pretty decent today. Slept around 7 hours
            which is solid for me lately. Did a 20 minute mobility
            routine and some light stretching, my back already feels
            better.
          </Typography>

          <Typography>
            Work is moving again. Got the BLE config service working
            the way I want and the GATT structure is finally clicking.
            Still need to wire up the polarity switch circuit with
            Pete later this week.
          </Typography>

          <Typography>
            Listened to a bunch of Bon Iver on the way in. Helps me
            get in a calm headspace. Thinking about making a playlist
            for deep focus days.
          </Typography>

          <Typography>
            Mood feels steady, not amazing, not drained. Just trying
            to stack good days and keep the momentum.
          </Typography>

          <Typography>
            Grateful for good coffee and people who build cool things.
          </Typography>
        </Stack>
>>>>>>> e032b66 (Feat: add Journal page layout and integrate with dashboard)

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mt={4}>
          <Typography variant='caption' color='text.secondary'>
<<<<<<< HEAD
            {recordedLabel ? `${recordedLabel} • ` : ''}
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
=======
            7:43 AM • ~4 min • 612 words
>>>>>>> e032b66 (Feat: add Journal page layout and integrate with dashboard)
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

// ─── EntryHeader ──────────────────────────────────────────────────────────────

/**
 * Editable title row with unsaved-changes dot indicator.
 * Shows an amber dot when the user has typed a change not yet saved to the API.
 */
function EntryHeader({
  title,
  savedTitle,
  onTitleChange,
  onTitleSave,
  headerDate,
  actions,
  // Dirty indicator only makes sense for entries that have a saved
  // server-side title to compare against.  Drafts can't be "saved" —
  // their title goes along with the commit payload.
  canBeDirty = true,
}) {
  const isDirty = canBeDirty && title !== savedTitle;

  return (
    <Box>
      <Stack direction='row' spacing={1} alignItems='center' mb={1}>
        <MenuBook color='primary' fontSize='small' />
        <Typography color='primary' fontWeight={700}>
          {headerDate}
        </Typography>
        {isDirty && (
          <Tooltip title='Unsaved title — press Enter or click away to save'>
            <FiberManualRecord
              sx={{ fontSize: 10, color: 'warning.main', ml: 0.5 }}
            />
          </Tooltip>
        )}
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}>
        <TextField
          variant='standard'
          fullWidth
          value={title}
          placeholder='New entry'
          onChange={(e) => onTitleChange(e.target.value)}
          onBlur={() => isDirty && onTitleSave(title)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (isDirty) onTitleSave(title);
            }
          }}
          InputProps={{
            disableUnderline: !isDirty,
            sx: {
              fontSize: (theme) => theme.typography.h3.fontSize,
              fontWeight: 700,
            },
          }}
        />
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          flexShrink={0}>
          {actions}
        </Stack>
      </Stack>
    </Box>
  );
}

// ─── Mood helpers ─────────────────────────────────────────────────────────────

function moodLabelToTone(label) {
  if (!label) return 'neutral';
  const normalized = String(label).toLowerCase();
  if (
    [
      'good',
      'great',
      'positive',
      'happy',
      'calm',
      'grateful',
    ].includes(normalized)
  )
    return 'good';
  if (
    ['low', 'sad', 'anxious', 'stressed', 'angry', 'down'].includes(
      normalized,
    )
  )
    return 'low';
  return 'neutral';
}

// ─── MoodTrend ────────────────────────────────────────────────────────────────

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
                const tone = moodLabelToTone(point.label);
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
                      bgcolor:
                        tone === 'low'
                          ? 'warning.main'
                          : 'primary.main',
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

// ─── formatDayLabel ───────────────────────────────────────────────────────────

function formatDayLabel(isoDate) {
  if (!isoDate) return '';
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  if (isoDate === todayKey) return 'Today';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// ─── InsightsPanel ────────────────────────────────────────────────────────────

function InsightsPanel({ insights, loading, error, onRefresh }) {
  const summary = insights?.summary;
  const moodTrend = insights?.mood_trend;
  const streak = insights?.streak;
  const themes = insights?.themes?.themes || [];
  const recentMoods = insights?.recent_moods?.moods || [];
  const generatedAt = insights?.generated_at;

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
            <IconButton
              size='small'
              onClick={onRefresh}
              disabled={loading}
              title='Refresh insights'>
              <Refresh fontSize='small' />
            </IconButton>
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
                  <MoodDot mood={moodLabelToTone(mood.label)} />
                </Stack>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NEW_ENTRY = {
  id: null,
  title: 'New entry',
  rawTranscript: '',
  cleanedTranscript: null,
  segments: [],
  source: 'voice',
  status: null,
  createdAt: null,
  date: '',
  time: '',
  mood: 'neutral',
};

// ─── DashboardJournalLayout ───────────────────────────────────────────────────

const DashboardJournalLayout = () => {
  const dispatch = useDispatch();

  // ── Redux state ────────────────────────────────────────────────────────
  const entries = useSelector((s) => s.journal.entries);
  const insights = useSelector((s) => s.journal.insights);
  const insightsLoading = useSelector(
    (s) => s.journal.insightsLoading,
  );
  const insightsError = useSelector((s) => s.journal.insightsError);
  const committing = useSelector((s) => s.journal.committing);
  const commitError = useSelector((s) => s.journal.commitError);

  // ── Local UI state ─────────────────────────────────────────────────────
  const [searchValue, setSearchValue] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(NEW_ENTRY);
  const [draftSegments, setDraftSegments] = useState([]);
  const [committed, setCommitted] = useState(false);
  const [committedEntryId, setCommittedEntryId] = useState(null);
  const [titleOverride, setTitleOverride] = useState(null);
  const [transcriptOverride, setTranscriptOverride] = useState(null);
  const [activeTab, setActiveTab] = useState('write');
  // Bumped after commit (with a delay) to force JournalAnalysisCard to
  // re-fetch and pick up the backend analysis once it's done.
  const [analysisRefreshKey, setAnalysisRefreshKey] = useState(0);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  // Tracks the most recently polished entry so we can show an Undo button.
  const [polishedEntryId, setPolishedEntryId] = useState(null);

  // ── Derived values ─────────────────────────────────────────────────────
  const transcript = useMemo(() => {
    if (transcriptOverride !== null) return transcriptOverride;
    if (selectedEntry.id) {
      return (
        selectedEntry.cleanedTranscript ||
        selectedEntry.rawTranscript ||
        ''
      );
    }
    return draftSegments.map((s) => s.transcript).join('\n\n');
  }, [transcriptOverride, draftSegments, selectedEntry]);

  const recordedAt = selectedEntry.id
    ? selectedEntry.createdAt
    : draftSegments[0]?.started_at || null;

  // Title shown in the editable field
  const displayTitle =
    titleOverride !== null
      ? titleOverride
      : selectedEntry.id
        ? selectedEntry.title
        : 'New entry';

  // Baseline for the dirty check: stored title for existing entries, placeholder for drafts
  const savedTitle = selectedEntry.id
    ? selectedEntry.title
    : 'New entry';

  const headerDate = useMemo(() => {
    const source = recordedAt || new Date().toISOString();
    return new Date(source).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [recordedAt]);

  // ── Effects ────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(journalActions.loadEntries());
    dispatch(journalActions.loadInsights());
  }, [dispatch]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const resetDraft = useCallback(() => {
    setDraftSegments([]);
    setCommitted(false);
    setCommittedEntryId(null);
    dispatch(setCommitError(null));
    setTitleOverride(null);
    setTranscriptOverride(null);
  }, [dispatch]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    setDraftSegments([]);
    setCommitted(Boolean(entry.id));
    // committedEntryId tracks entries that were committed *in this session*
    // (so the Write tab can show a fresh analysis card).  Selecting an
    // existing entry from the sidebar should NOT trigger that — clear it.
    setCommittedEntryId(null);
    dispatch(setCommitError(null));
    setTitleOverride(null);
    setTranscriptOverride(null);
  };

  const handleNewEntry = () => {
    setSelectedEntry(NEW_ENTRY);
    resetDraft();
    setActiveTab('write');
  };

  const handleUndo = useCallback(() => {
    setDraftSegments((prev) => prev.slice(0, -1));
    setTranscriptOverride(null);
  }, []);

  const handlePatchTranscript = useCallback(
    (entryId, text) => {
      dispatch(journalActions.patchEntryTranscript(entryId, text));
      // Optimistic local update so the card re-renders immediately
      setSelectedEntry((prev) =>
        prev.id === entryId
          ? { ...prev, rawTranscript: text, cleanedTranscript: null }
          : prev,
      );
    },
    [dispatch],
  );

  const handleTitleSave = useCallback(
    (newTitle) => {
      if (selectedEntry.id) {
        dispatch(
          journalActions.patchEntryTitle(selectedEntry.id, newTitle),
        );
        // Optimistic local update
        setSelectedEntry((prev) => ({ ...prev, title: newTitle }));
      }
      // For a draft entry, titleOverride is already set and will be
      // sent to the backend when the entry is committed.
    },
    [dispatch, selectedEntry.id],
  );

  const handleTranscriptReady = useCallback((text, meta) => {
    setDraftSegments((prev) => [
      ...prev,
      {
        clip_id: meta?.clip_id || null,
        started_at: meta?.started_at || new Date().toISOString(),
        duration_seconds: meta?.duration_seconds ?? null,
        transcript: text,
      },
    ]);
    setCommitted(false);
    setTranscriptOverride(null);
  }, []);

  const handleCommit = useCallback(async () => {
    if (
      selectedEntry.id ||
      committing ||
      committed ||
      draftSegments.length === 0
    )
      return;
    if (!transcript.trim()) return;

    const payload = {
      title: titleOverride?.trim() || null,
      source: 'voice',
      raw_transcript: transcript,
      segments: draftSegments,
    };

    const created = await dispatch(
      journalActions.commitEntry(payload),
    );
    if (created) {
      // Navigate to the new entry so the user can see it.
      setSelectedEntry(created);
      setCommitted(true);
      setCommittedEntryId(created.id);
      setDraftSegments([]);
      setTitleOverride(null);
      setTranscriptOverride(null);
      setActiveTab('journal');
      // Backend analysis is async — give it a moment then re-fetch the
      // entry so the JournalAnalysisCard picks up mood/themes/etc.
      setTimeout(() => {
        setAnalysisRefreshKey((k) => k + 1);
      }, 4000);
    }
  }, [
    committed,
    committing,
    dispatch,
    draftSegments,
    selectedEntry.id,
    titleOverride,
    transcript,
  ]);

  // ── Action nodes ───────────────────────────────────────────────────────
  const writeTabActions = (
    <Button
      variant='outlined'
      startIcon={<Add />}
      onClick={handleNewEntry}>
      New Entry
    </Button>
  );

  const handleDeleteEntry = useCallback(async () => {
    if (!selectedEntry.id) return;
    const id = selectedEntry.id;
    setConfirmDeleteOpen(false);
    const ok = await dispatch(journalActions.deleteEntry(id));
    if (ok) {
      if (committedEntryId === id) setCommittedEntryId(null);
      if (polishedEntryId === id) setPolishedEntryId(null);
      setSelectedEntry(NEW_ENTRY);
      resetDraft();
      setActiveTab('journal');
    }
  }, [
    committedEntryId,
    dispatch,
    polishedEntryId,
    resetDraft,
    selectedEntry.id,
  ]);

  const handlePolishEntry = useCallback(
    async (modes) => {
      if (!selectedEntry.id) return;
      const updated = await dispatch(
        journalActions.polishEntry(selectedEntry.id, modes),
      );
      if (updated) {
        setSelectedEntry((prev) =>
          prev.id === updated.id ? { ...prev, ...updated } : prev,
        );
        setPolishedEntryId(updated.id);
        setTranscriptOverride(null);
      }
    },
    [dispatch, selectedEntry.id],
  );

  const handleUndoPolishEntry = useCallback(async () => {
    if (!selectedEntry.id) return;
    const updated = await dispatch(
      journalActions.undoPolishEntry(selectedEntry.id),
    );
    if (updated) {
      setSelectedEntry((prev) =>
        prev.id === updated.id ? { ...prev, ...updated } : prev,
      );
      setPolishedEntryId(null);
      setTranscriptOverride(null);
    }
  }, [dispatch, selectedEntry.id]);

  const journalEntryActions = (
    <Tooltip title='Delete entry'>
      <IconButton
        size='small'
        color='error'
        onClick={() => setConfirmDeleteOpen(true)}>
        <DeleteOutline fontSize='small' />
      </IconButton>
    </Tooltip>
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label='Write' value='write' />
        <Tab label='Journal' value='journal' />
        <Tab label='Insights' value='insights' />
      </Tabs>

      {/* ── Write tab ──────────────────────────────────────────────────── */}
      {activeTab === 'write' && (
        <Stack spacing={3}>
          <Box>
            <EntryHeader
              title={displayTitle}
              savedTitle={savedTitle}
              onTitleChange={setTitleOverride}
              onTitleSave={handleTitleSave}
              headerDate={headerDate}
              actions={writeTabActions}
              canBeDirty={Boolean(selectedEntry.id)}
            />
            {commitError && (
              <Typography
                variant='caption'
                color='error'
                sx={{ display: 'block', mt: 1 }}>
                {commitError}
              </Typography>
            )}
          </Box>

          <JournalRecorder
            onTranscriptReady={handleTranscriptReady}
          />

          <TranscriptCard
            transcript={transcript}
            committed={committed}
            committing={committing}
            onCommit={handleCommit}
            title={displayTitle}
            recordedAt={recordedAt}
            isEditable={!committed}
            onEdit={setTranscriptOverride}
            onUndo={handleUndo}
            canUndo={draftSegments.length > 0 && !committed}
          />

          {committedEntryId && (
            <JournalAnalysisCard
              entryId={committedEntryId}
              refreshKey={analysisRefreshKey}
              variant='compact'
            />
          )}
        </Stack>
      )}

      {/* ── Journal tab ────────────────────────────────────────────────── */}
      {activeTab === 'journal' && (
        <Grid container spacing={3} alignItems='stretch'>
          <Grid item xs={12} md={4}>
            <JournalSidebar
              entries={entries}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              selectedEntry={selectedEntry}
              onSelectEntry={handleSelectEntry}
              onNewEntry={handleNewEntry}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            {selectedEntry.id ? (
              <Stack spacing={3}>
                <EntryHeader
                  title={displayTitle}
                  savedTitle={savedTitle}
                  onTitleChange={setTitleOverride}
                  onTitleSave={handleTitleSave}
                  headerDate={headerDate}
                  actions={journalEntryActions}
                />

                <TranscriptCard
                  transcript={transcript}
                  committed={true}
                  committing={false}
                  onCommit={() => {}}
                  title={displayTitle}
                  recordedAt={recordedAt}
                  isEditable
                  onEdit={(text) =>
                    handlePatchTranscript(selectedEntry.id, text)
                  }
                  onPolish={handlePolishEntry}
                  onUndoPolish={handleUndoPolishEntry}
                  canUndoPolish={polishedEntryId === selectedEntry.id}
                />

                <JournalAnalysisCard
                  entryId={selectedEntry.id}
                  refreshKey={analysisRefreshKey}
                  variant='detail'
                />
              </Stack>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 400,
                }}>
                <Typography color='text.secondary'>
                  Select an entry to view
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      )}

      {/* ── Insights tab ───────────────────────────────────────────────── */}
      {activeTab === 'insights' && (
        <InsightsPanel
          insights={insights}
          loading={insightsLoading}
          error={insightsError}
          onRefresh={() => dispatch(journalActions.loadInsights())}
        />
      )}

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Delete entry?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete{' '}
            <strong>{selectedEntry.title || 'this entry'}</strong>.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            color='error'
            variant='contained'
            onClick={handleDeleteEntry}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { DashboardJournalLayout };
