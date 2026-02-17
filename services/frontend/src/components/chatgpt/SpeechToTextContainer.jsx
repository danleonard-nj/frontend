import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import {
  Alert,
  Box,
  Chip,
  Paper,
  Tooltip,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMessage,
  clearMessage,
  setIsRecording,
  clearError,
  setDiarizeEnabled,
  setWaveformEnabled,
  setWaveformOverlay,
  setCurrentAudioFile,
  setTranscriptionSegments,
  setActiveSegmentIndex,
} from '../../store/speechToText/speechToTextSlice';
import {
  transcribeAudio,
  transcribeFile,
  getTranscriptionHistory,
} from '../../store/speechToText/speechToTextActions';
import DiarizedTranscript from './DiarizedTranscript';
import useRecorderStateMachine, {
  RecState,
} from './useRecorderStateMachine';
import WaveformVisualizer from './WaveformVisualizer';
import AudioPlayer from './AudioPlayer';
import WaveformOverlayViewer from './WaveformOverlayViewer';

/**
 * Speech-to-Text Input Component with Redux Integration
 *
 * Uses an explicit state-machine recorder (idle → arming → recording → stopping → processing → idle)
 * with ChatGPT-style recording UX: mic button when idle, waveform + cancel/confirm when recording.
 */
const SpeechToTextContainer = () => {
  const dispatch = useDispatch();
  const {
    message,
    isTranscribing,
    transcriptionHistory,
    transcriptionHistoryLoading,
    error,
    diarizeEnabled,
    waveformEnabled,
    waveformOverlay,
    currentAudioFile,
    transcriptionSegments,
    audioCurrentTime,
    activeSegmentIndex,
  } = useSelector((x) => x.speechToText);

  const fileInputRef = useRef(null);
  const [lastAudioBlob, setLastAudioBlob] = useState(null);
  const [debugAudioUrl, setDebugAudioUrl] = useState(null);

  // Keep Redux isRecording in sync with the state machine (for other components that read it)
  const diarizeRef = useRef(diarizeEnabled);
  diarizeRef.current = diarizeEnabled;

  const waveformRef = useRef(waveformEnabled);
  waveformRef.current = waveformEnabled;

  /**
   * Called by the state machine when recording is confirmed and audio is ready.
   * Dispatches the existing transcribeAudio action — no backend changes.
   */
  const handleAudioReady = useCallback(
    async (audioBlob) => {
      setLastAudioBlob(audioBlob); // Store for debug playback
      // Create blob URL for audio player
      if (debugAudioUrl) URL.revokeObjectURL(debugAudioUrl);
      setDebugAudioUrl(URL.createObjectURL(audioBlob));
      try {
        await dispatch(
          transcribeAudio(
            audioBlob,
            diarizeRef.current,
            waveformRef.current,
          ),
        );
      } catch {
        // Error handled by Redux action
      }
    },
    [dispatch, debugAudioUrl],
  );

  const { phase, analyserNode, arm, confirm, cancel } =
    useRecorderStateMachine({
      onAudioReady: handleAudioReady,
    });

  // Derived booleans
  const isRecordingActive =
    phase === RecState.RECORDING || phase === RecState.ARMING;
  const isBusy =
    phase === RecState.STOPPING || phase === RecState.PROCESSING;

  // Sync Redux isRecording flag so other components stay in sync
  useEffect(() => {
    dispatch(setIsRecording(isRecordingActive));
  }, [isRecordingActive, dispatch]);

  const handleMessageChange = (event) => {
    dispatch(setMessage(event.target.value));
    dispatch(clearError());
  };

  const handleClearMessage = () => {
    dispatch(clearMessage());
    dispatch(setTranscriptionSegments(null));
    dispatch(setCurrentAudioFile(null));
    dispatch(setActiveSegmentIndex(-1));
    dispatch(setWaveformOverlay(null));
  };

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (debugAudioUrl) {
        URL.revokeObjectURL(debugAudioUrl);
      }
    };
  }, [debugAudioUrl]);

  const handleCopyToClipboard = async () => {
    if (!message.trim()) return;
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // Clipboard copy failed silently
    }
  };

  /**
   * Start recording (arm the state machine)
   */
  const handleMicClick = useCallback(async () => {
    try {
      await arm();
    } catch {
      alert(
        'Microphone access is required for voice input. Please grant permission and try again.',
      );
    }
  }, [arm]);

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Process uploaded audio file
   */
  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const validTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/webm',
        'audio/ogg',
        'audio/m4a',
        'audio/mp4',
      ];

      if (
        !validTypes.includes(file.type) &&
        !file.name.match(/\.(mp3|wav|webm|ogg|m4a|mp4)$/i)
      ) {
        alert(
          'Please upload a valid audio file (MP3, WAV, WEBM, OGG, M4A)',
        );
        return;
      }

      const maxSize = 25 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 25MB');
        return;
      }

      try {
        await dispatch(
          transcribeFile(file, diarizeEnabled, waveformEnabled),
        );
      } catch {
        // Error handled by Redux action
      }

      event.target.value = '';
    },
    [dispatch, diarizeEnabled],
  );

  // Load transcription history on mount
  useEffect(() => {
    dispatch(getTranscriptionHistory());
  }, [dispatch]);

  // ── Determine which recorder chrome to show ──────────────────────
  const showMicButton =
    phase === RecState.IDLE && !isTranscribing && !isBusy;
  const showWaveform = phase === RecState.RECORDING;
  const showArming = phase === RecState.ARMING;
  const showProcessing =
    isTranscribing || phase === RecState.STOPPING || isBusy;

  return (
    <Box sx={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
        {/* ── Header row: title + option chips ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
          }}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Speech to Text
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title='Identify individual speakers in the transcript'>
              <Chip
                icon={<RecordVoiceOverIcon />}
                label='Diarize'
                size='small'
                variant={diarizeEnabled ? 'filled' : 'outlined'}
                color={diarizeEnabled ? 'primary' : 'default'}
                onClick={() =>
                  !(isRecordingActive || isTranscribing) &&
                  dispatch(setDiarizeEnabled(!diarizeEnabled))
                }
                disabled={isRecordingActive || isTranscribing}
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
            <Tooltip title='Return a processed waveform image'>
              <Chip
                icon={<GraphicEqIcon />}
                label='Waveform'
                size='small'
                variant={waveformEnabled ? 'filled' : 'outlined'}
                color={waveformEnabled ? 'primary' : 'default'}
                onClick={() =>
                  !(isRecordingActive || isTranscribing) &&
                  dispatch(setWaveformEnabled(!waveformEnabled))
                }
                disabled={isRecordingActive || isTranscribing}
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </Box>
        </Box>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          accept='audio/*,.mp3,.wav,.webm,.ogg,.m4a'
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Error alert */}
        {error && (
          <Alert
            severity='error'
            onClose={() => dispatch(clearError())}
            sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ── Text area with inline recording controls ── */}
        <Box sx={{ position: 'relative', mb: 1.5 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={10}
            value={message}
            onChange={handleMessageChange}
            placeholder='Transcribed text appears here...'
            variant='outlined'
            disabled={isRecordingActive}
            sx={{
              '& .MuiOutlinedInput-root': {
                paddingBottom: showWaveform ? '56px' : undefined,
              },
            }}
          />

          {/* Recording overlay bar — anchored inside text area bottom */}
          {showWaveform && (
            <Box
              sx={{
                position: 'absolute',
                left: 8,
                right: 8,
                bottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                backgroundColor: 'rgba(0,0,0,0.65)',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
              }}>
              <IconButton
                onClick={cancel}
                size='small'
                sx={{
                  color: 'grey.400',
                  '&:hover': {
                    color: 'error.light',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
                title='Cancel recording'>
                <CloseIcon fontSize='small' />
              </IconButton>

              <Box sx={{ flex: 1 }}>
                <WaveformVisualizer
                  analyserNode={analyserNode}
                  isActive={phase === RecState.RECORDING}
                />
              </Box>

              <IconButton
                onClick={confirm}
                size='small'
                sx={{
                  color: 'grey.400',
                  '&:hover': {
                    color: 'success.light',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
                title='Finish recording'>
                <CheckIcon fontSize='small' />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* ── Toolbar: primary actions left, secondary actions right ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}>
          {/* Left: input actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Record button */}
            {showMicButton && (
              <Button
                variant='contained'
                size='small'
                startIcon={<MicIcon />}
                onClick={handleMicClick}
                sx={{ textTransform: 'none' }}>
                Record
              </Button>
            )}

            {/* Arming state — pulsing indicator */}
            {showArming && (
              <Button
                variant='contained'
                color='error'
                size='small'
                disabled
                startIcon={
                  <CircularProgress
                    size={16}
                    thickness={5}
                    sx={{ color: 'inherit' }}
                  />
                }
                sx={{ textTransform: 'none' }}>
                Starting...
              </Button>
            )}

            {/* Processing / transcribing state */}
            {showProcessing && (
              <Button
                variant='contained'
                size='small'
                disabled
                startIcon={
                  <CircularProgress
                    size={16}
                    thickness={5}
                    sx={{ color: 'inherit' }}
                  />
                }
                sx={{ textTransform: 'none' }}>
                Transcribing...
              </Button>
            )}

            <Button
              variant='outlined'
              size='small'
              startIcon={<UploadFileIcon />}
              onClick={handleFileUpload}
              disabled={isRecordingActive || isTranscribing}
              sx={{ textTransform: 'none' }}>
              Upload
            </Button>

            {/* Status text — visible on sm+ */}
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ display: { xs: 'none', sm: 'block' }, ml: 0.5 }}>
              {message.length > 0 && `${message.length} chars`}
              {isRecordingActive && 'Recording...'}
            </Typography>
          </Box>

          {/* Right: output actions */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title='Clear'>
              <span>
                <IconButton
                  size='small'
                  onClick={handleClearMessage}
                  disabled={
                    !message.trim() ||
                    isRecordingActive ||
                    isTranscribing
                  }>
                  <ClearIcon fontSize='small' />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='Copy to clipboard'>
              <span>
                <IconButton
                  size='small'
                  onClick={handleCopyToClipboard}
                  disabled={
                    !message.trim() ||
                    isRecordingActive ||
                    isTranscribing
                  }>
                  <ContentCopyIcon fontSize='small' />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Inline audio player — shown when a recording exists ── */}
        {debugAudioUrl && (
          <Box sx={{ mt: 2 }}>
            <AudioPlayer
              audioUrl={debugAudioUrl}
              disabled={isRecordingActive || isTranscribing}
              compact
              size='small'
            />
          </Box>
        )}
      </Paper>

      {/* ── Diarized Transcript ── */}
      {transcriptionSegments && currentAudioFile && (
        <DiarizedTranscript
          audioUrl={currentAudioFile}
          segments={transcriptionSegments}
          currentTime={audioCurrentTime}
          activeIndex={activeSegmentIndex}
        />
      )}

      {/* ── Waveform Overlay ── */}
      {waveformOverlay && (
        <WaveformOverlayViewer base64Png={waveformOverlay} />
      )}

      {/* ── Recent Transcriptions (collapsible) ── */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='recent-transcriptions-content'
          id='recent-transcriptions-header'>
          <Typography variant='subtitle1'>
            Recent Transcriptions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {transcriptionHistoryLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 3,
              }}>
              <CircularProgress size={28} />
            </Box>
          ) : transcriptionHistory.length > 0 ? (
            <List disablePadding>
              {transcriptionHistory
                .slice(0, 10)
                .map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems='flex-start' sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.text}
                        secondary={
                          item.timestamp
                            ? new Date(
                                item.timestamp,
                              ).toLocaleString()
                            : 'Just now'
                        }
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: {
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          },
                        }}
                      />
                    </ListItem>
                    {index <
                      Math.min(transcriptionHistory.length, 10) -
                        1 && <Divider />}
                  </React.Fragment>
                ))}
            </List>
          ) : (
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ textAlign: 'center', py: 2 }}>
              No transcriptions yet. Record or upload audio to get
              started.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SpeechToTextContainer;
