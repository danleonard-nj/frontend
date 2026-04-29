import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add,
  Check,
  ContentCopy,
  Edit,
  GraphicEq,
  MoreHoriz,
  Search,
  Settings,
  Tune,
  AutoAwesome,
  MenuBook,
} from '@mui/icons-material';
import JournalRecorder from '../journal/JournalRecorder';
import JournalAnalysisCard from '../journal/JournalAnalysisCard';
import JournalApi from '../../api/journalApi';

const fallbackEntries = [
  {
    date: 'Tue, Apr 28',
    title: 'Morning thoughts',
    time: '7:43 AM',
    mood: 'good',
  },
];

const themes = [
  'health',
  'music',
  'work',
  'family',
  'focus',
  'routine',
];

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

function JournalSidebar({
  entries,
  searchValue,
  onSearchChange,
  selectedEntry,
  onSelectEntry,
  onNewEntry,
}) {
  const visibleEntries = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return entries;
    }

    return entries.filter((entry) => {
      const content =
        `${entry.date} ${entry.title} ${entry.time}`.toLowerCase();

      return content.includes(normalizedSearch);
    });
  }, [entries, searchValue]);

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

              <IconButton>
                <Edit fontSize='small' />
              </IconButton>
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
                endAdornment: (
                  <InputAdornment position='end'>
                    <Typography
                      variant='caption'
                      color='text.secondary'>
                      Ctrl+K
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ px: 1.5, pb: 1.5, flex: 1, overflowY: 'auto' }}>
            <Typography
              variant='overline'
              color='text.secondary'
              fontWeight={700}
              sx={{ px: 1 }}>
              Entries
            </Typography>

            <List disablePadding sx={{ mb: 3 }}>
              {visibleEntries.map((entry) => {
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
                        <Stack
                          direction='row'
                          justifyContent='space-between'
                          spacing={2}>
                          <Typography
                            variant='caption'
                            color='text.secondary'>
                            {entry.date}
                          </Typography>
                          <Typography
                            variant='caption'
                            color='text.secondary'>
                            {entry.time}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack
                          direction='row'
                          alignItems='center'
                          mt={0.75}>
                          <MoodDot mood={entry.mood} />
                          <Typography
                            variant='body2'
                            color='text.primary'
                            fontWeight={600}>
                            {entry.title}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItemButton>
                );
              })}

              {visibleEntries.length === 0 && (
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ px: 1, py: 2 }}>
                  No entries yet
                </Typography>
              )}
            </List>
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
              onClick={onNewEntry}
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

function TranscriptCard({
  transcript,
  committed,
  committing,
  onCommit,
  title,
  recordedAt,
}) {
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
              size='small'
              onClick={handleCopy}
              disabled={!transcript}>
              <ContentCopy fontSize='small' />
            </IconButton>
            <IconButton size='small'>
              <Edit fontSize='small' />
            </IconButton>
            <IconButton size='small'>
              <Tune fontSize='small' />
            </IconButton>
          </Stack>
        </Stack>

        {paragraphs.length > 0 ? (
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

          <Button
            variant='contained'
            startIcon={<Check />}
            onClick={onCommit}
            disabled={committed || committing || !transcript}>
            {committed
              ? `${title} committed`
              : committing
                ? 'Committing…'
                : 'Commit entry'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function MoodTrend() {
  const values = [
    44, 37, 52, 23, 48, 31, 55, 49, 28, 45, 30, 41, 51, 56,
  ];

  return (
    <Card variant='outlined'>
      <CardContent>
        <Typography
          variant='overline'
          color='text.secondary'
          fontWeight={700}>
          Mood trend
        </Typography>

        <Box
          sx={{
            height: 90,
            display: 'flex',
            alignItems: 'end',
            gap: 1,
            mt: 2,
          }}>
          {values.map((value, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: value,
                borderRadius: 1,
                bgcolor:
                  index === 3 ? 'warning.main' : 'primary.main',
                opacity: 0.75,
              }}
            />
          ))}
        </Box>

        <Stack direction='row' justifyContent='space-between' mt={1}>
          <Typography variant='caption' color='text.secondary'>
            14 days
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            today
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function InsightsPanel() {
  return (
    <Stack spacing={2}>
      <Card variant='outlined'>
        <CardContent>
          <Stack
            direction='row'
            alignItems='center'
            spacing={1}
            mb={2}>
            <AutoAwesome color='primary' fontSize='small' />
            <Typography
              variant='overline'
              color='text.secondary'
              fontWeight={700}>
              AI Summary
            </Typography>
          </Stack>

          <Box component='ul' sx={{ pl: 2.5, mt: 0, mb: 2 }}>
            <li>
              Good sleep and morning routine set a positive tone.
            </li>
            <li>
              Progress on BLE/GATT work, with wiring still pending.
            </li>
            <li>Music helped with focus and mood regulation.</li>
            <li>Mood is steady and grateful.</li>
          </Box>

          <Typography variant='caption' color='text.secondary'>
            Generated just now
          </Typography>
        </CardContent>
      </Card>

      <MoodTrend />

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
            <Typography variant='h3'>6</Typography>
            <Typography color='text.secondary'>
              days in a row
            </Typography>
          </Stack>
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

          <Stack direction='row' flexWrap='wrap' gap={1} mt={2}>
            {themes.map((theme) => (
              <Chip
                key={theme}
                size='small'
                label={theme}
                variant='outlined'
              />
            ))}
          </Stack>
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

          <Stack spacing={1.5} mt={2}>
            {[
              ['Today', 'good'],
              ['Sun, Apr 26', 'good'],
              ['Sat, Apr 25', 'good'],
              ['Fri, Apr 24', 'low'],
              ['Wed, Apr 22', 'good'],
            ].map(([day, mood]) => (
              <Stack
                key={day}
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Typography variant='body2' color='text.secondary'>
                  {day}
                </Typography>
                <MoodDot mood={mood} />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

function deriveTitle(transcript) {
  const trimmed = (transcript || '').trim();
  if (!trimmed) return 'Untitled entry';
  return trimmed.split(/\s+/).slice(0, 5).join(' ');
}

function moodFromAnalysis(analysis) {
  const label = analysis?.mood?.label;
  if (!label) return 'neutral';
  const normalized = label.toLowerCase();
  if (
    [
      'good',
      'great',
      'positive',
      'happy',
      'calm',
      'grateful',
    ].includes(normalized)
  ) {
    return 'good';
  }
  if (
    ['low', 'sad', 'anxious', 'stressed', 'angry', 'down'].includes(
      normalized,
    )
  ) {
    return 'low';
  }
  return 'neutral';
}

function entryFromApi(raw) {
  if (!raw) return null;
  const createdAt = raw.created_at || raw.createdAt || null;
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : '';
  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';
  return {
    id: raw.entry_id || raw.entryId || raw.id || null,
    title: raw.title || 'Untitled entry',
    rawTranscript: raw.raw_transcript || raw.rawTranscript || '',
    cleanedTranscript:
      raw.cleaned_transcript || raw.cleanedTranscript || null,
    segments: Array.isArray(raw.segments) ? raw.segments : [],
    source: raw.source || 'voice',
    status: raw.status || 'created',
    createdAt,
    date,
    time,
    mood: moodFromAnalysis(raw.analysis),
  };
}

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

const DashboardJournalLayout = () => {
  const api = useMemo(() => new JournalApi(), []);

  const [entries, setEntries] = useState(fallbackEntries);
  const [searchValue, setSearchValue] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(NEW_ENTRY);
  const [draftSegments, setDraftSegments] = useState([]);
  const [committed, setCommitted] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [committedEntryId, setCommittedEntryId] = useState(null);
  const [commitError, setCommitError] = useState(null);
  const [titleOverride, setTitleOverride] = useState(null);

  const transcript = useMemo(() => {
    if (selectedEntry.id) {
      return (
        selectedEntry.cleanedTranscript ||
        selectedEntry.rawTranscript ||
        ''
      );
    }
    return draftSegments.map((s) => s.transcript).join('\n\n');
  }, [draftSegments, selectedEntry]);

  const recordedAt = selectedEntry.id
    ? selectedEntry.createdAt
    : draftSegments[0]?.started_at || null;

  const effectiveTitle =
    titleOverride !== null
      ? titleOverride
      : selectedEntry.id
        ? selectedEntry.title
        : deriveTitle(transcript);

  const loadEntries = useCallback(async () => {
    try {
      const response = await api.listEntries(50);
      if (response.status === 200) {
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.entries)
            ? response.data.entries
            : [];
        setEntries(list.map(entryFromApi).filter(Boolean));
      }
    } catch {
      // Leave fallback entries in place
    }
  }, [api]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const resetDraft = useCallback(() => {
    setDraftSegments([]);
    setCommitted(false);
    setCommittedEntryId(null);
    setCommitError(null);
    setTitleOverride(null);
  }, []);

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    setDraftSegments([]);
    setCommitted(Boolean(entry.id));
    setCommittedEntryId(entry.id || null);
    setCommitError(null);
    setTitleOverride(null);
  };

  const handleNewEntry = () => {
    setSelectedEntry(NEW_ENTRY);
    resetDraft();
  };

  const handleTranscriptReady = useCallback((text, meta) => {
    setDraftSegments((prev) => [
      ...prev,
      {
        clip_id: null,
        started_at: meta?.started_at || new Date().toISOString(),
        duration_seconds: meta?.duration_seconds ?? null,
        transcript: text,
      },
    ]);
    setCommitted(false);
  }, []);

  const handleCommit = useCallback(async () => {
    if (
      selectedEntry.id ||
      committing ||
      committed ||
      draftSegments.length === 0
    ) {
      return;
    }

    const rawTranscript = draftSegments
      .map((s) => s.transcript)
      .join('\n\n');

    if (!rawTranscript.trim()) return;

    const payload = {
      title: effectiveTitle,
      source: 'voice',
      raw_transcript: rawTranscript,
      segments: draftSegments,
    };

    setCommitting(true);
    setCommitError(null);
    try {
      const response = await api.createEntry(payload);
      if (response.status === 201 || response.status === 200) {
        const created = entryFromApi(response.data) || {
          ...NEW_ENTRY,
          id: response.data?.entry_id || null,
          title: effectiveTitle,
          rawTranscript,
          segments: draftSegments,
          createdAt: new Date().toISOString(),
        };
        setCommittedEntryId(created.id);
        setCommitted(true);
        setSelectedEntry(created);
        setDraftSegments([]);
        setEntries((prev) => {
          const without = prev.filter(
            (e) => e.id && e.id !== created.id,
          );
          return [created, ...without];
        });
      } else {
        setCommitError(`Commit failed (${response.status})`);
      }
    } catch (err) {
      setCommitError(err.message || 'Commit failed');
    } finally {
      setCommitting(false);
    }
  }, [
    api,
    committed,
    committing,
    draftSegments,
    effectiveTitle,
    selectedEntry.id,
  ]);

  const headerDate = useMemo(() => {
    const source = recordedAt || new Date().toISOString();
    return new Date(source).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [recordedAt]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} alignItems='stretch'>
        <Grid item xs={12} lg={3} sx={{ order: { xs: 2, lg: 1 } }}>
          <JournalSidebar
            entries={entries}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedEntry={selectedEntry}
            onSelectEntry={handleSelectEntry}
            onNewEntry={handleNewEntry}
          />
        </Grid>

        <Grid item xs={12} lg={6} sx={{ order: { xs: 1, lg: 2 } }}>
          <Stack spacing={3}>
            <Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent='space-between'
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                mb={2}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction='row'
                    spacing={1}
                    alignItems='center'
                    mb={1}>
                    <MenuBook color='primary' fontSize='small' />
                    <Typography color='primary' fontWeight={700}>
                      {headerDate}
                    </Typography>
                  </Stack>
                  <TextField
                    variant='standard'
                    fullWidth
                    value={effectiveTitle}
                    onChange={(event) =>
                      setTitleOverride(event.target.value)
                    }
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        fontSize: (theme) =>
                          theme.typography.h3.fontSize,
                        fontWeight: 700,
                      },
                    }}
                  />
                </Box>

                <Stack
                  direction='row'
                  spacing={1}
                  alignItems='center'>
                  <IconButton>
                    <MoreHoriz />
                  </IconButton>
                  <Badge
                    color='success'
                    variant='dot'
                    invisible={!committed}>
                    <Button
                      variant='outlined'
                      startIcon={<Check />}
                      disabled={committing}
                      onClick={handleCommit}>
                      {committed ? 'Saved' : 'Ready'}
                    </Button>
                  </Badge>
                </Stack>
              </Stack>

              {commitError && (
                <Typography
                  variant='caption'
                  color='error'
                  sx={{ display: 'block', mb: 1 }}>
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
              title={effectiveTitle}
              recordedAt={recordedAt}
            />
            {committedEntryId && (
              <JournalAnalysisCard entryId={committedEntryId} />
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} lg={3} sx={{ order: { xs: 3, lg: 3 } }}>
          <InsightsPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export { DashboardJournalLayout };
