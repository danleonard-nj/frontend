import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import JournalApi from '../../api/journalApi';

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

const JournalAnalysisCard = ({ entryId }) => {
  const api = useMemo(() => new JournalApi(), []);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState(null);

  const fetchEntry = useCallback(async () => {
    if (!entryId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.getEntry(entryId);
      if (response.status === 200) {
        setEntry(response.data);
      } else if (response.status === 404) {
        setEntry(null);
        setError('Entry not found');
      } else {
        setError(`Failed to load entry (${response.status})`);
      }
    } catch (err) {
      setError(err.message || 'Failed to load entry');
    } finally {
      setLoading(false);
    }
  }, [api, entryId]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  const status = entry?.status;
  const analysis = entry?.analysis || null;
  const processingMeta = entry?.processing || null;
  const isReady = status === 'processed' && analysis;
  const isInFlight = status === 'queued' || status === 'processing';
  const canRequestProcess =
    status && !isInFlight && !TERMINAL_STATUSES.has(status);
  const canRetry = status === 'failed';

  const handleProcess = useCallback(
    async (force = false) => {
      if (!entryId) return;
      setProcessing(true);
      setError(null);
      try {
        await api.processEntry(entryId, force);
        await fetchEntry();
      } catch (err) {
        setError(err.message || 'Failed to request processing');
      } finally {
        setProcessing(false);
      }
    },
    [api, entryId, fetchEntry],
  );

  const extras = analysis
    ? Object.entries(analysis).filter(
        ([key, value]) =>
          ![
            'summary',
            'bullets',
            'themes',
            'mood',
            'symptoms',
            'action_items',
            'risk_flags',
          ].includes(key) &&
          value !== null &&
          value !== undefined,
      )
    : [];

  const riskFlags = analysis?.risk_flags || null;
  const hasRiskFlags =
    riskFlags &&
    (riskFlags.crisis_language || riskFlags.medical_concern);

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
              onClick={fetchEntry}
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
            {analysis.summary && (
              <Typography
                variant='body1'
                sx={{ fontStyle: 'italic' }}>
                {analysis.summary}
              </Typography>
            )}

            {Array.isArray(analysis.bullets) &&
              analysis.bullets.length > 0 && (
                <Box>
                  <SectionLabel>Highlights</SectionLabel>
                  <Box component='ul' sx={{ pl: 2.5, mt: 1, mb: 0 }}>
                    {analysis.bullets.map((bullet, index) => (
                      <li key={index}>
                        <Typography variant='body2'>
                          {bullet}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>
              )}

            {analysis.mood && (
              <Box>
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
                    {typeof analysis.mood.confidence === 'number' &&
                      ` • ${Math.round(
                        analysis.mood.confidence * 100,
                      )}% confidence`}
                  </Typography>
                </Stack>
              </Box>
            )}

            {Array.isArray(analysis.themes) &&
              analysis.themes.length > 0 && (
                <Box>
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
              )}

            {Array.isArray(analysis.symptoms) &&
              analysis.symptoms.length > 0 && (
                <Box>
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
              )}

            {Array.isArray(analysis.action_items) &&
              analysis.action_items.length > 0 && (
                <Box>
                  <SectionLabel>Action items</SectionLabel>
                  <Box component='ul' sx={{ pl: 2.5, mt: 1, mb: 0 }}>
                    {analysis.action_items.map((item, index) => (
                      <li key={index}>
                        <Typography variant='body2'>
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>
              )}

            {hasRiskFlags && (
              <Box>
                <SectionLabel>Risk flags</SectionLabel>
                <Stack direction='row' flexWrap='wrap' gap={1} mt={1}>
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
            )}

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
