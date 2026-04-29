import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Check, Close, Mic, Tune } from '@mui/icons-material';
import useRecorderStateMachine, {
  RecState,
} from '../chatgpt/useRecorderStateMachine';
import WaveformVisualizer from '../chatgpt/WaveformVisualizer';
import SpeechToTextApi from '../../api/speechToTextApi';

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
  const api = useMemo(() => new SpeechToTextApi(), []);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const clipStartRef = useRef(null);

  const handleAudioReady = useCallback(
    async (audioBlob) => {
      setIsTranscribing(true);
      setError(null);
      const startedAt = clipStartRef.current;
      const durationSeconds = startedAt
        ? (Date.now() - new Date(startedAt).getTime()) / 1000
        : null;
      clipStartRef.current = null;
      try {
        const result = await api.transcribeAudio(audioBlob);
        const text = (result?.text || '').trim();
        if (text && typeof onTranscriptReady === 'function') {
          onTranscriptReady(text, {
            started_at: startedAt || new Date().toISOString(),
            duration_seconds: durationSeconds,
            clip_id: result?.transcription_id || null,
          });
        }
      } catch (err) {
        setError(err.message || 'Transcription failed');
      } finally {
        setIsTranscribing(false);
      }
    },
    [api, onTranscriptReady],
  );

  const { phase, analyserNode, arm, confirm, cancel } =
    useRecorderStateMachine({ onAudioReady: handleAudioReady });

  const isRecording = phase === RecState.RECORDING;
  const isArming = phase === RecState.ARMING;
  const isStopping =
    phase === RecState.STOPPING || phase === RecState.PROCESSING;

  const handleMicClick = useCallback(async () => {
    setError(null);
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
