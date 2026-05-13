import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
  ReplayOutlined,
} from '@mui/icons-material';
import { journalActions } from '../../store/journal/journalActions';
import {
  BulletList,
  ChipList,
  ExtraFields,
  MoodSection,
  RiskFlags,
  SectionLabel,
} from './JournalAnalysisSections';

const TERMINAL_STATUSES = new Set(['processed', 'failed']);
const POLL_INTERVAL_MS = 2000;

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

const STATUS_CHIP_COLOR = {
  processed: 'success',
  failed: 'error',
};

function getKeyEvents(analysis) {
  if (Array.isArray(analysis.key_events)) return analysis.key_events;
  if (Array.isArray(analysis.bullets)) return analysis.bullets;
  return [];
}

function renderSection(section, analysis) {
  switch (section) {
    case 'summary_short': {
      const text = analysis.summary_short || analysis.summary;
      return text ? (
        <Typography variant='body1' sx={{ fontStyle: 'italic' }}>
          {text}
        </Typography>
      ) : null;
    }
    case 'summary_detailed': {
      const text = analysis.summary_detailed || analysis.summary;
      return text ? (
        <Typography variant='body1'>{text}</Typography>
      ) : null;
    }
    case 'key_events_top':
      return (
        <BulletList
          label='Key events'
          items={getKeyEvents(analysis)}
          limit={3}
        />
      );
    case 'key_events':
      return (
        <BulletList
          label='Key events'
          items={getKeyEvents(analysis)}
        />
      );
    case 'stressors':
      return (
        <ChipList
          label='Stressors'
          items={analysis.stressors}
          color='warning'
        />
      );
    case 'positive_developments':
      return (
        <BulletList
          label='Positives'
          items={analysis.positive_developments}
        />
      );
    case 'open_loops':
      return (
        <BulletList label='Open loops' items={analysis.open_loops} />
      );
    case 'mood':
      return <MoodSection mood={analysis.mood} />;
    case 'themes':
      return <ChipList label='Themes' items={analysis.themes} />;
    case 'people_mentioned':
      return (
        <ChipList label='People' items={analysis.people_mentioned} />
      );
    case 'places_or_contexts':
      return (
        <ChipList
          label='Places & contexts'
          items={analysis.places_or_contexts}
        />
      );
    case 'symptoms':
      return (
        <ChipList
          label='Symptoms'
          items={analysis.symptoms}
          color='warning'
        />
      );
    case 'action_items':
      return (
        <BulletList
          label='Action items'
          items={analysis.action_items}
        />
      );
    case 'risk_flags':
      return <RiskFlags flags={analysis.risk_flags} />;
    default:
      return null;
  }
}

const JournalAnalysisCard = ({ entryId, variant = 'detail' }) => {
  const dispatch = useDispatch();
  const detail = useSelector(
    (s) => s.journal.entryDetails[entryId] || EMPTY_DETAIL,
  );
  const { entry, loading, processing, error } = detail;

  // Track whether a fetch is in flight to prevent the background
  // poller from stacking duplicate requests (e.g. when the network is
  // slow and the response takes longer than POLL_INTERVAL_MS).
  const inFlightRef = useRef(false);
  useEffect(() => {
    inFlightRef.current = loading;
  }, [loading]);

  const fetchEntry = useCallback(
    (opts) => {
      if (inFlightRef.current && opts?.silent) return undefined;
      return dispatch(journalActions.loadEntryDetail(entryId, opts));
    },
    [dispatch, entryId],
  );

  useEffect(() => {
    if (!entryId) return;
    fetchEntry();
  }, [entryId, fetchEntry]);

  const status = entry?.status;

  // Background poll: while the entry is queued/processing (or has no
  // analysis yet on a non-terminal status), silently re-fetch every
  // POLL_INTERVAL_MS until we hit a terminal state (processed /
  // failed) or the entry changes. The in-flight guard above prevents
  // overlapping requests if a fetch is already pending.
  useEffect(() => {
    if (!entryId) return undefined;
    if (status && TERMINAL_STATUSES.has(status)) return undefined;
    const interval = setInterval(() => {
      fetchEntry({ silent: true });
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [entryId, status, fetchEntry]);

  const analysis = entry?.analysis || null;
  const processingMeta = entry?.processing || null;
  const isReady = status === 'processed' && analysis;
  const isInFlight = status === 'queued' || status === 'processing';
  const canRequestProcess =
    status && !isInFlight && !TERMINAL_STATUSES.has(status);
  const canRetry = status === 'failed';

  const handleProcess = (force = false) => {
    if (!entryId) return;
    dispatch(journalActions.processEntryAnalysis(entryId, force));
  };

  const handleReprocess = () => {
    if (!entryId) return;
    dispatch(journalActions.reprocessEntryAnalysis(entryId));
  };

  const extras =
    analysis && variant === 'detail'
      ? Object.entries(analysis).filter(
          ([key, value]) =>
            !KNOWN_ANALYSIS_KEYS.has(key) &&
            value !== null &&
            value !== undefined,
        )
      : [];

  const sections =
    VARIANT_SECTIONS[variant] || VARIANT_SECTIONS.detail;

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
                color={STATUS_CHIP_COLOR[status] || 'default'}
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
            <IconButton
              size='small'
              onClick={handleReprocess}
              disabled={loading || processing || isInFlight}
              title='Regenerate analysis'>
              <ReplayOutlined fontSize='small' />
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
              const node = renderSection(section, analysis);
              return node ? (
                <React.Fragment key={section}>{node}</React.Fragment>
              ) : null;
            })}
            <ExtraFields entries={extras} />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalAnalysisCard;
