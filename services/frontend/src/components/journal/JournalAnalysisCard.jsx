import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  AutoAwesome,
  PlayArrow,
  Refresh,
  Warning,
} from '@mui/icons-material';
import { journalActions } from '../../store/journal/journalActions';

const TERMINAL_STATUSES = new Set(['processed', 'failed']);

function moodTone(label) {
  if (!label) return 'text.disabled';
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
    return 'success.main';
  }
  if (
    ['low', 'sad', 'anxious', 'stressed', 'angry', 'down'].includes(
      normalized,
    )
  ) {
    return 'warning.main';
  }
  return 'text.disabled';
}

function MoodDot({ label }) {
  return (
    <Box
      component='span'
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: moodTone(label),
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <Typography
      variant='overline'
      color='text.secondary'
      fontWeight={700}>
      {children}
    </Typography>
  );
}

// Sections shown per variant. Order matters — it controls render order.
const VARIANT_SECTIONS = {
  compact: ['summary_short', 'key_events_top'],
  detail: [
    'summary_detailed',
    'key_events',
    'stressors',
    'positive_developments',
    'open_loops',
    'mood',
    'themes',
    'people_mentioned',
    'places_or_contexts',
    'symptoms',
    'action_items',
    'risk_flags',
  ],
  digest: [
    'summary_detailed',
    'key_events',
    'mood',
    'themes',
    'open_loops',
  ],
};

const KNOWN_ANALYSIS_KEYS = new Set([
  'cleaned_transcript',
  'summary',
  'summary_short',
  'summary_detailed',
  'bullets',
  'key_events',
  'people_mentioned',
  'places_or_contexts',
  'stressors',
  'positive_developments',
  'open_loops',
  'themes',
  'mood',
  'symptoms',
  'action_items',
  'risk_flags',
]);

const EMPTY_DETAIL = {
  entry: null,
  loading: false,
  processing: false,
  error: null,
};

const JournalAnalysisCard = ({
  entryId,
  refreshKey = 0,
  variant = 'detail',
}) => {
  const dispatch = useDispatch();
  const detail = useSelector(
    (s) => s.journal.entryDetails[entryId] || EMPTY_DETAIL,
  );
  const { entry, loading, processing, error } = detail;

  const fetchEntry = useCallback(
    (opts) => dispatch(journalActions.loadEntryDetail(entryId, opts)),
    [dispatch, entryId],
  );

  useEffect(() => {
    if (!entryId) return;
    fetchEntry();
    // refreshKey allows callers to force a re-fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId, fetchEntry, refreshKey]);

  const status = entry?.status;

  // Background poll: while the entry is queued/processing (or has no
  // analysis yet on a non-terminal status), silently re-fetch every 2s
  // until we hit a terminal state (processed / failed) or the entry
  // changes.
  useEffect(() => {
    if (!entryId) return undefined;
    if (status && TERMINAL_STATUSES.has(status)) return undefined;
    const interval = setInterval(() => {
      fetchEntry({ silent: true });
    }, 2000);
    return () => clearInterval(interval);
  }, [entryId, status, fetchEntry]);

  const analysis = entry?.analysis || null;
  const processingMeta = entry?.processing || null;
  const isReady = status === 'processed' && analysis;
  const isInFlight = status === 'queued' || status === 'processing';
  const canRequestProcess =
    status && !isInFlight && !TERMINAL_STATUSES.has(status);
  const canRetry = status === 'failed';

  const handleProcess = useCallback(
    (force = false) => {
      if (!entryId) return;
      dispatch(journalActions.processEntryAnalysis(entryId, force));
    },
    [dispatch, entryId],
  );

  const extras =
    analysis && variant === 'detail'
      ? Object.entries(analysis).filter(
          ([key, value]) =>
            !KNOWN_ANALYSIS_KEYS.has(key) &&
            value !== null &&
            value !== undefined,
        )
      : [];

  const riskFlags = analysis?.risk_flags || null;
  const hasRiskFlags =
    riskFlags &&
    (riskFlags.crisis_language || riskFlags.medical_concern);

  const sections =
    VARIANT_SECTIONS[variant] || VARIANT_SECTIONS.detail;
  const summaryShort =
    analysis?.summary_short || analysis?.summary || null;
  const summaryDetailed =
    analysis?.summary_detailed || analysis?.summary || null;
  const keyEvents = Array.isArray(analysis?.key_events)
    ? analysis.key_events
    : Array.isArray(analysis?.bullets)
      ? analysis.bullets
      : [];

  return (
    <Card variant='outlined'>
      <CardContent>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={2}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <AutoAwesome color='primary' fontSize='small' />
            <SectionLabel>Entry Analysis</SectionLabel>
            {status && (
              <Chip
                size='small'
                label={status}
                color={
                  status === 'processed'
                    ? 'success'
                    : status === 'failed'
                      ? 'error'
                      : 'default'
                }
                variant='outlined'
              />
            )}
          </Stack>
          <Stack direction='row' spacing={0.5}>
            {(canRequestProcess || canRetry) && (
              <IconButton
                size='small'
                onClick={() => handleProcess(canRetry)}
                disabled={processing || loading}
                title={
                  canRetry ? 'Retry processing' : 'Process entry'
                }>
                <PlayArrow fontSize='small' />
              </IconButton>
            )}
            <IconButton
              size='small'
              onClick={() => fetchEntry()}
              disabled={loading || processing}
              title='Refresh'>
              <Refresh fontSize='small' />
            </IconButton>
          </Stack>
        </Stack>

        {(loading || processing) && (
          <Stack alignItems='center' py={3}>
            <CircularProgress size={24} />
          </Stack>
        )}

        {!loading && !processing && error && (
          <Typography variant='body2' color='error'>
            {error}
          </Typography>
        )}

        {!loading && !processing && !error && !isReady && (
          <Stack spacing={1}>
            <Typography variant='body2' color='text.secondary'>
              {status === 'failed'
                ? 'Processing failed. Use retry to try again.'
                : 'Analysis not yet available'}
            </Typography>
            {processingMeta?.error && (
              <Typography variant='caption' color='error'>
                {processingMeta.error}
              </Typography>
            )}
          </Stack>
        )}

        {!loading && !processing && !error && isReady && (
          <Stack spacing={2.5}>
            {sections.map((section) => {
              switch (section) {
                case 'summary_short':
                  return summaryShort ? (
                    <Typography
                      key={section}
                      variant='body1'
                      sx={{ fontStyle: 'italic' }}>
                      {summaryShort}
                    </Typography>
                  ) : null;

                case 'summary_detailed':
                  return summaryDetailed ? (
                    <Typography key={section} variant='body1'>
                      {summaryDetailed}
                    </Typography>
                  ) : null;

                case 'key_events_top':
                  return keyEvents.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Key events</SectionLabel>
                      <Box
                        component='ul'
                        sx={{ pl: 2.5, mt: 1, mb: 0 }}>
                        {keyEvents.slice(0, 3).map((item, index) => (
                          <li key={index}>
                            <Typography variant='body2'>
                              {item}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  ) : null;

                case 'key_events':
                  return keyEvents.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Key events</SectionLabel>
                      <Box
                        component='ul'
                        sx={{ pl: 2.5, mt: 1, mb: 0 }}>
                        {keyEvents.map((item, index) => (
                          <li key={index}>
                            <Typography variant='body2'>
                              {item}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  ) : null;

                case 'stressors':
                  return Array.isArray(analysis.stressors) &&
                    analysis.stressors.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Stressors</SectionLabel>
                      <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={1}
                        mt={1}>
                        {analysis.stressors.map((item, index) => (
                          <Chip
                            key={`${item}-${index}`}
                            size='small'
                            label={item}
                            variant='outlined'
                            color='warning'
                          />
                        ))}
                      </Stack>
                    </Box>
                  ) : null;

                case 'positive_developments':
                  return Array.isArray(
                    analysis.positive_developments,
                  ) && analysis.positive_developments.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Positives</SectionLabel>
                      <Box
                        component='ul'
                        sx={{ pl: 2.5, mt: 1, mb: 0 }}>
                        {analysis.positive_developments.map(
                          (item, index) => (
                            <li key={index}>
                              <Typography variant='body2'>
                                {item}
                              </Typography>
                            </li>
                          ),
                        )}
                      </Box>
                    </Box>
                  ) : null;

                case 'open_loops':
                  return Array.isArray(analysis.open_loops) &&
                    analysis.open_loops.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Open loops</SectionLabel>
                      <Box
                        component='ul'
                        sx={{ pl: 2.5, mt: 1, mb: 0 }}>
                        {analysis.open_loops.map((item, index) => (
                          <li key={index}>
                            <Typography variant='body2'>
                              {item}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  ) : null;

                case 'mood':
                  return analysis.mood ? (
                    <Box key={section}>
                      <SectionLabel>Mood</SectionLabel>
                      <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        mt={1}>
                        <MoodDot label={analysis.mood.label} />
                        <Typography variant='body2'>
                          {analysis.mood.label || 'unknown'}
                          {typeof analysis.mood.score === 'number' &&
                            ` • score ${analysis.mood.score}`}
                          {typeof analysis.mood.confidence ===
                            'number' &&
                            ` • ${Math.round(
                              analysis.mood.confidence * 100,
                            )}% confidence`}
                        </Typography>
                      </Stack>
                    </Box>
                  ) : null;

                case 'themes':
                  return Array.isArray(analysis.themes) &&
                    analysis.themes.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Themes</SectionLabel>
                      <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={1}
                        mt={1}>
                        {analysis.themes.map((theme) => (
                          <Chip
                            key={theme}
                            size='small'
                            label={theme}
                            variant='outlined'
                          />
                        ))}
                      </Stack>
                    </Box>
                  ) : null;

                case 'people_mentioned':
                  return Array.isArray(analysis.people_mentioned) &&
                    analysis.people_mentioned.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>People</SectionLabel>
                      <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={1}
                        mt={1}>
                        {analysis.people_mentioned.map(
                          (person, index) => (
                            <Chip
                              key={`${person}-${index}`}
                              size='small'
                              label={person}
                              variant='outlined'
                            />
                          ),
                        )}
                      </Stack>
                    </Box>
                  ) : null;

                case 'places_or_contexts':
                  return Array.isArray(analysis.places_or_contexts) &&
                    analysis.places_or_contexts.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Places & contexts</SectionLabel>
                      <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={1}
                        mt={1}>
                        {analysis.places_or_contexts.map(
                          (place, index) => (
                            <Chip
                              key={`${place}-${index}`}
                              size='small'
                              label={place}
                              variant='outlined'
                            />
                          ),
                        )}
                      </Stack>
                    </Box>
                  ) : null;

                case 'symptoms':
                  return Array.isArray(analysis.symptoms) &&
                    analysis.symptoms.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Symptoms</SectionLabel>
                      <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={1}
                        mt={1}>
                        {analysis.symptoms.map((symptom) => (
                          <Chip
                            key={symptom}
                            size='small'
                            label={symptom}
                            variant='outlined'
                            color='warning'
                          />
                        ))}
                      </Stack>
                    </Box>
                  ) : null;

                case 'action_items':
                  return Array.isArray(analysis.action_items) &&
                    analysis.action_items.length > 0 ? (
                    <Box key={section}>
                      <SectionLabel>Action items</SectionLabel>
                      <Box
                        component='ul'
                        sx={{ pl: 2.5, mt: 1, mb: 0 }}>
                        {analysis.action_items.map((item, index) => (
                          <li key={index}>
                            <Typography variant='body2'>
                              {item}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  ) : null;

                case 'risk_flags':
                  return hasRiskFlags ? (
                    <Box key={section}>
                      <SectionLabel>Risk flags</SectionLabel>
                      <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={1}
                        mt={1}>
                        {riskFlags.crisis_language && (
                          <Chip
                            size='small'
                            icon={<Warning />}
                            label='Crisis language'
                            color='error'
                          />
                        )}
                        {riskFlags.medical_concern && (
                          <Chip
                            size='small'
                            icon={<Warning />}
                            label='Medical concern'
                            color='warning'
                          />
                        )}
                      </Stack>
                    </Box>
                  ) : null;

                default:
                  return null;
              }
            })}

            {extras.length > 0 && (
              <Stack spacing={0.5}>
                {extras.map(([key, value]) => (
                  <Typography
                    key={key}
                    variant='body2'
                    color='text.secondary'>
                    <strong>{key}:</strong>{' '}
                    {typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                  </Typography>
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalAnalysisCard;
