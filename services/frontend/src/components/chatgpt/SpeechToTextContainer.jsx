import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
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
import MicOffIcon from '@mui/icons-material/MicOff';
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

/**
 * Speech-to-Text Input Component with Redux Integration
 *
 * This component uses the browser's MediaRecorder API to capture audio,
 * sends chunks to the backend for transcription via Redux actions,
 * and manages state through the Redux store.
 */
const SpeechToTextContainer = () => {
  const dispatch = useDispatch();
  const {
    message,
    isRecording,
    isTranscribing,
    transcriptionHistory,
    transcriptionHistoryLoading,
    error,
    lastTranscription,
    diarizeEnabled,
    currentAudioFile,
    transcriptionSegments,
    audioCurrentTime,
    activeSegmentIndex,
  } = useSelector((x) => x.speechToText);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const handleMessageChange = (event) => {
    dispatch(setMessage(event.target.value));
    dispatch(clearError());
  };

  const handleClearMessage = () => {
    dispatch(clearMessage());
    // Also clear diarized transcript data
    dispatch(setTranscriptionSegments(null));
    dispatch(setCurrentAudioFile(null));
    dispatch(setActiveSegmentIndex(-1));
  };

  const handleCopyToClipboard = async () => {
    if (!message.trim()) return;

    try {
      await navigator.clipboard.writeText(message);
    } catch (error) {
      // Clipboard copy failed silently
    }
  };

  /**
   * Process the recorded audio by sending it to the backend for transcription
   */
  const processRecordedAudio = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      return;
    }

    try {
      // Combine all audio chunks into a single blob
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm;codecs=opus',
      });

      // Clear the chunks
      audioChunksRef.current = [];

      // Send to backend for transcription with diarization enabled if toggle is on
      await dispatch(transcribeAudio(audioBlob, diarizeEnabled));
    } catch (error) {
      // Transcription error handled by Redux action
    }
  }, [dispatch, diarizeEnabled]);

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Set up audio level monitoring
      try {
        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const analyser = audioContext.createAnalyser();
        const microphone =
          audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Start monitoring audio levels
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (analyserRef.current && streamRef.current) {
            analyser.getByteFrequencyData(dataArray);

            // Calculate average volume (0-255)
            const average =
              dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            // Normalize to 0-1 range with some amplification
            const normalized = Math.min((average / 128) * 1.5, 1);

            setAudioLevel(normalized);
            animationFrameRef.current =
              requestAnimationFrame(updateLevel);
          }
        };
        updateLevel();
      } catch (audioError) {
        // Audio level monitoring not available
      }

      // Determine best supported mime type
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;

      // Collect audio data - this will only fire when recording stops
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Process audio when recording stops
      mediaRecorder.onstop = async () => {
        await processRecordedAudio();
      };

      mediaRecorder.onerror = (event) => {
        stopRecording();
      };

      // Start recording - no timeslice parameter means single chunk
      mediaRecorder.start();
      dispatch(setIsRecording(true));
    } catch (error) {
      alert(
        'Microphone access is required for voice input. Please grant permission and try again.',
      );
    }
  }, [dispatch, processRecordedAudio]);

  /**
   * Stop recording audio
   */
  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clean up audio monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);

    dispatch(setIsRecording(false));
  }, [dispatch]);

  /**
   * Toggle recording state
   */
  const handleMicClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

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

      // Validate file type
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

      // Validate file size (e.g., 25MB limit)
      const maxSize = 25 * 1024 * 1024; // 25MB
      if (file.size > maxSize) {
        alert('File size must be less than 25MB');
        return;
      }

      try {
        await dispatch(transcribeFile(file, diarizeEnabled));
      } catch (error) {
        // Error handled by Redux action
      }

      // Clear the input so the same file can be uploaded again
      event.target.value = '';
    },
    [dispatch, diarizeEnabled],
  );

  // Load transcription history on mount
  useEffect(() => {
    dispatch(getTranscriptionHistory());
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

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
                disabled={isRecording || isTranscribing}
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
            disabled={isRecording}
            sx={{
              '& .MuiOutlinedInput-root': {
                paddingRight: '60px',
              },
            }}
          />

          {/* Microphone button positioned at bottom-right */}
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
            {isTranscribing ? (
              <CircularProgress
                size={36}
                thickness={4}
                sx={{ color: 'primary.main' }}
              />
            ) : (
              <Box
                sx={{ position: 'relative', display: 'inline-flex' }}>
                {/* Animated audio level rings */}
                {isRecording && (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: 2,
                        borderColor: 'error.main',
                        transform: 'translate(-50%, -50%)',
                        opacity: audioLevel * 0.6,
                        transition: 'all 0.1s ease-out',
                        pointerEvents: 'none',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 40 + audioLevel * 16,
                        height: 40 + audioLevel * 16,
                        borderRadius: '50%',
                        border: 1.5,
                        borderColor: 'error.light',
                        transform: 'translate(-50%, -50%)',
                        opacity: audioLevel * 0.4,
                        transition: 'all 0.15s ease-out',
                        pointerEvents: 'none',
                      }}
                    />
                  </>
                )}
                <IconButton
                  onClick={handleMicClick}
                  color={isRecording ? 'error' : 'primary'}
                  size='small'
                  sx={{
                    backgroundColor: isRecording
                      ? 'error.light'
                      : 'action.hover',
                    '&:hover': {
                      backgroundColor: isRecording
                        ? 'error.main'
                        : 'action.selected',
                    },
                    transition: 'all 0.2s ease-in-out',
                    transform:
                      isRecording && audioLevel > 0.3
                        ? `scale(${1 + audioLevel * 0.1})`
                        : 'scale(1)',
                  }}
                  title={
                    isRecording ? 'Stop recording' : 'Start recording'
                  }>
                  {isRecording ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
              </Box>
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
            {isRecording && ' • Recording...'}
            {isTranscribing && ' • Transcribing...'}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              order: { xs: 1, sm: 2 },
            }}>
            <Button
              variant='outlined'
              startIcon={<UploadFileIcon />}
              onClick={handleFileUpload}
              disabled={isRecording || isTranscribing}>
              Upload Audio
            </Button>
            <Button
              variant='outlined'
              startIcon={<ClearIcon />}
              onClick={handleClearMessage}
              disabled={
                !message.trim() || isRecording || isTranscribing
              }>
              Clear
            </Button>
            <Button
              variant='contained'
              endIcon={<ContentCopyIcon />}
              onClick={handleCopyToClipboard}
              disabled={
                !message.trim() || isRecording || isTranscribing
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
