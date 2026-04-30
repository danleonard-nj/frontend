import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  Check,
  Close,
  Mic,
  Refresh,
  Tune,
} from '@mui/icons-material';
import useRecorderStateMachine, {
  RecState,
} from '../chatgpt/useRecorderStateMachine';
import WaveformVisualizer from '../chatgpt/WaveformVisualizer';
import { journalActions } from '../../store/journal/journalActions';

/**
 * Journal-side recorder. Black-box wrapper around the existing
 * recorder state machine + waveform primitives used on the
 * Speech-to-Text page. Calls the same /api/tools/transcribe
 * backend endpoint and emits the resulting text via
 * onTranscriptReady(text, segmentMeta).
 *
 * segmentMeta: { started_at: ISO string, duration_seconds: number }
 *
 * Intentionally has no "Saved clips" section — only the record
 * button, waveform, and settings row.
 */
const JournalRecorder = ({ onTranscriptReady }) => {
  const dispatch = useDispatch();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  // Preserves the most recent failed clip so the user can retry without
  // re-recording.  Cleared on success, on cancel/discard, or when a new
  // recording is armed.
  const [pendingClip, setPendingClip] = useState(null);
  const clipStartRef = useRef(null);

  const transcribeClip = useCallback(
    async (clip) => {
      setIsTranscribing(true);
      setError(null);
      const result = await dispatch(
        journalActions.transcribeJournalClip(clip.blob),
      );
      setIsTranscribing(false);
      if (!result) {
        setError('Transcription failed');
        setPendingClip(clip);
        return;
      }
      if (result.text && typeof onTranscriptReady === 'function') {
        onTranscriptReady(result.text, {
          started_at: clip.startedAt,
          duration_seconds: clip.durationSeconds,
          clip_id: result.transcriptionId,
        });
      }
      setPendingClip(null);
    },
    [dispatch, onTranscriptReady],
  );

  const handleAudioReady = useCallback(
    async (audioBlob) => {
      const startedAt =
        clipStartRef.current || new Date().toISOString();
      const durationSeconds = clipStartRef.current
        ? (Date.now() - new Date(clipStartRef.current).getTime()) /
          1000
        : null;
      clipStartRef.current = null;
      await transcribeClip({
        blob: audioBlob,
        startedAt,
        durationSeconds,
      });
    },
    [transcribeClip],
  );

  const { phase, analyserNode, arm, confirm, cancel } =
    useRecorderStateMachine({ onAudioReady: handleAudioReady });

  const isRecording = phase === RecState.RECORDING;
  const isArming = phase === RecState.ARMING;
  const isStopping =
    phase === RecState.STOPPING || phase === RecState.PROCESSING;

  const handleMicClick = useCallback(async () => {
    setError(null);
    // Starting a fresh recording discards any previous failed clip.
    setPendingClip(null);
    try {
      clipStartRef.current = new Date().toISOString();
      await arm();
    } catch {
      clipStartRef.current = null;
      setError(
        'Microphone access is required. Please grant permission and try again.',
      );
    }
  }, [arm]);

  const handleCancel = useCallback(() => {
    clipStartRef.current = null;
    cancel();
  }, [cancel]);

  const handleRetry = useCallback(() => {
    if (pendingClip) transcribeClip(pendingClip);
  }, [pendingClip, transcribeClip]);

  const handleDiscardPending = useCallback(() => {
    setPendingClip(null);
    setError(null);
  }, []);

  const statusLabel = isTranscribing
    ? 'Transcribing…'
    : isStopping
      ? 'Processing…'
      : isArming
        ? 'Starting mic…'
        : isRecording
          ? 'Recording'
          : error
            ? error
            : 'Ready to record';

  return (
    <Card variant='outlined'>
      <CardContent>
        <Stack direction='row' spacing={3} alignItems='center'>
          <Box sx={{ textAlign: 'center', width: 96 }}>
            {isRecording ? (
              <Stack
                direction='row'
                spacing={1}
                justifyContent='center'>
                <IconButton
                  onClick={handleCancel}
                  sx={{
                    width: 48,
                    height: 48,
                    border: 1,
                    borderColor: 'divider',
                  }}
                  title='Cancel recording'>
                  <Close />
                </IconButton>
                <IconButton
                  onClick={confirm}
                  sx={{
                    width: 48,
                    height: 48,
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                    '&:hover': { bgcolor: 'success.dark' },
                  }}
                  title='Finish recording'>
                  <Check />
                </IconButton>
              </Stack>
            ) : (
              <IconButton
                onClick={handleMicClick}
                disabled={isArming || isStopping || isTranscribing}
                sx={{
                  width: 64,
                  height: 64,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'error.main',
                  color: 'error.contrastText',
                  '&:hover': { bgcolor: 'error.dark' },
                }}>
                {isArming || isStopping || isTranscribing ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <Mic />
                )}
              </IconButton>
            )}
            <Typography variant='body2' mt={1}>
              {isRecording ? 'Stop' : 'Record'}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ height: 40 }}>
              <WaveformVisualizer
                analyserNode={analyserNode}
                isActive={isRecording}
              />
            </Box>
            <Typography
              variant='caption'
              color={error ? 'error' : 'text.secondary'}
              sx={{ mt: 1, display: 'block' }}>
              {statusLabel}
            </Typography>
            {pendingClip && !isTranscribing && (
              <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                sx={{ mt: 1 }}>
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<Refresh />}
                  onClick={handleRetry}>
                  Retry transcription
                </Button>
                <Button
                  size='small'
                  color='inherit'
                  onClick={handleDiscardPending}>
                  Discard clip
                </Button>
              </Stack>
            )}
          </Box>

          <IconButton>
            <Tune />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default JournalRecorder;
