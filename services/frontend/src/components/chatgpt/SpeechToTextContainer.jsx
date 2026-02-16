import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import {
  Box,
  Paper,
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
  FormControlLabel,
  Switch,
  Accordion,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant='h5' gutterBottom>
          Speech-to-Text Chat Input
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mb: 2 }}>
          Type your message, click the microphone button to record
          audio, or upload an audio file. The transcribed text will be
          appended to your message.
        </Typography>

        {/* Diarization Toggle */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={diarizeEnabled}
                onChange={(e) =>
                  dispatch(setDiarizeEnabled(e.target.checked))
                }
                disabled={isRecordingActive || isTranscribing}
              />
            }
            label='Enable speaker diarization'
          />
          <Typography
            variant='caption'
            color='text.secondary'
            display='block'
            sx={{ ml: 4 }}>
            When enabled, the transcript will be broken down by
            speaker with playback synchronization.
          </Typography>
        </Box>

        {/* Waveform Overlay Toggle */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={waveformEnabled}
                onChange={(e) =>
                  dispatch(setWaveformEnabled(e.target.checked))
                }
                disabled={isRecordingActive || isTranscribing}
              />
            }
            label='Return processed waveform'
          />
          <Typography
            variant='caption'
            color='text.secondary'
            display='block'
            sx={{ ml: 4 }}>
            When enabled, the API returns a waveform overlay image you
            can inspect with zoom and pan.
          </Typography>
        </Box>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          accept='audio/*,.mp3,.wav,.webm,.ogg,.m4a'
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {error && (
          <Typography color='error' variant='body2' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Message Input Area */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={12}
            value={message}
            onChange={handleMessageChange}
            placeholder='Type or speak your message...'
            variant='outlined'
            disabled={isRecordingActive}
            sx={{
              '& .MuiOutlinedInput-root': {
                paddingRight: '60px',
              },
            }}
          />

          {/* ── Recording controls (bottom-right of text area) ── */}
          <Box
            sx={{
              position: 'absolute',
              left: 8,
              right: 8,
              bottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              justifyContent: 'flex-end',
            }}>
            {/* IDLE: single mic button */}
            {showMicButton && (
              <IconButton
                onClick={handleMicClick}
                color='primary'
                size='small'
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                }}
                title='Start recording'>
                <MicIcon />
              </IconButton>
            )}

            {/* ARMING: pulsing mic while we wait for permission + warm-up */}
            {showArming && (
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: 'error.main',
                    animation: 'stt-pulse 1.2s ease-in-out infinite',
                    pointerEvents: 'none',
                  }}
                />
                <IconButton
                  size='small'
                  disabled
                  sx={{
                    backgroundColor: 'error.dark',
                    color: 'white !important',
                  }}>
                  <MicIcon />
                </IconButton>
              </Box>
            )}

            {/* RECORDING: waveform + cancel/confirm */}
            {showWaveform && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: 6,
                  px: 1.5,
                  py: 0.5,
                  flex: 1,
                }}>
                {/* Cancel button */}
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

                {/* Waveform visualization */}
                <Box sx={{ flex: 1 }}>
                  <WaveformVisualizer
                    analyserNode={analyserNode}
                    isActive={phase === RecState.RECORDING}
                  />
                </Box>

                {/* Confirm button */}
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

            {/* PROCESSING / TRANSCRIBING spinner */}
            {showProcessing && (
              <CircularProgress
                size={36}
                thickness={4}
                sx={{ color: 'primary.main' }}
              />
            )}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 },
          }}>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
              order: { xs: 2, sm: 1 },
            }}>
            {message.length} characters
            {isRecordingActive && ' • Recording...'}
            {isTranscribing && ' • Transcribing...'}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              order: { xs: 1, sm: 2 },
              alignItems: 'center',
            }}>
            {debugAudioUrl && (
              <AudioPlayer
                audioUrl={debugAudioUrl}
                disabled={isRecordingActive || isTranscribing}
                compact
                size='small'
              />
            )}
            <Button
              variant='outlined'
              startIcon={<UploadFileIcon />}
              onClick={handleFileUpload}
              disabled={isRecordingActive || isTranscribing}>
              Upload Audio
            </Button>
            <Button
              variant='outlined'
              startIcon={<ClearIcon />}
              onClick={handleClearMessage}
              disabled={
                !message.trim() || isRecordingActive || isTranscribing
              }>
              Clear
            </Button>
            <Button
              variant='contained'
              endIcon={<ContentCopyIcon />}
              onClick={handleCopyToClipboard}
              disabled={
                !message.trim() || isRecordingActive || isTranscribing
              }>
              Copy to Clipboard
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Diarized Transcript Display */}
      {transcriptionSegments && currentAudioFile && (
        <DiarizedTranscript
          audioUrl={currentAudioFile}
          segments={transcriptionSegments}
          currentTime={audioCurrentTime}
          activeIndex={activeSegmentIndex}
        />
      )}

      {/* Waveform Overlay Display */}
      {waveformOverlay && (
        <WaveformOverlayViewer base64Png={waveformOverlay} />
      )}

      {/* Collapsible Recent Transcriptions Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='recent-transcriptions-content'
          id='recent-transcriptions-header'>
          <Typography variant='h6'>Recent Transcriptions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {transcriptionHistoryLoading ? (
            <CircularProgress />
          ) : transcriptionHistory.length > 0 ? (
            <List>
              {transcriptionHistory
                .slice(0, 10)
                .map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems='flex-start'>
                      <ListItemText
                        primary={item.text}
                        secondary={
                          item.timestamp
                            ? new Date(
                                item.timestamp,
                              ).toLocaleString()
                            : 'Just now'
                        }
                      />
                    </ListItem>
                    {index < transcriptionHistory.length - 1 && (
                      <Divider />
                    )}
                  </React.Fragment>
                ))}
            </List>
          ) : (
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mt: 2 }}>
              No transcription history yet. Start recording to create
              your first transcription!
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SpeechToTextContainer;
