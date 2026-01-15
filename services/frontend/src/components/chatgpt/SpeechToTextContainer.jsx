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
  Tab,
  Tabs,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMessage,
  clearMessage,
  setIsRecording,
  clearError,
} from '../../store/speechToText/speechToTextSlice';
import {
  transcribeAudio,
  getTranscriptionHistory,
} from '../../store/speechToText/speechToTextActions';

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
  } = useSelector((x) => x.speechToText);

  const [selectedTab, setSelectedTab] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const handleMessageChange = (event) => {
    dispatch(setMessage(event.target.value));
    dispatch(clearError());
  };

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    console.log('Sending message:', message);
    // Here you would send the message to your backend
    // For example: dispatch(sendChatMessage(message));

    // Clear message after sending
    dispatch(clearMessage());
  };

  /**
   * Transcribe audio chunk using Redux action
   */
  const transcribeAudioChunk = useCallback(
    async (audioBlob) => {
      try {
        await dispatch(transcribeAudio(audioBlob));
      } catch (error) {
        console.error('Transcription error:', error);
      }
    },
    [dispatch]
  );

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

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          await transcribeAudioChunk(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        stopRecording();
      };

      // Start recording with 1-second chunks
      mediaRecorder.start(1000);
      dispatch(setIsRecording(true));
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert(
        'Microphone access is required for voice input. Please grant permission and try again.'
      );
    }
  }, [dispatch, transcribeAudioChunk]);

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

  // Load transcription history on mount
  useEffect(() => {
    // Uncomment when backend history endpoint is ready
    // dispatch(getTranscriptionHistory());
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
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
          Type your message or click the microphone button to use
          voice input. Speech will be transcribed and appended to your
          message in real-time.
        </Typography>

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
            {isTranscribing && (
              <CircularProgress
                size={20}
                thickness={4}
                sx={{ color: 'primary.main' }}
              />
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
              }}
              title={
                isRecording ? 'Stop recording' : 'Start recording'
              }>
              {isRecording ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Typography variant='caption' color='text.secondary'>
            {message.length} characters
            {isRecording && ' • Recording...'}
            {isTranscribing && ' • Transcribing...'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant='outlined'
              startIcon={<ClearIcon />}
              onClick={handleClearMessage}
              disabled={!message.trim() || isRecording}>
              Clear
            </Button>
            <Button
              variant='contained'
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!message.trim() || isRecording}>
              Send Message
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tabs for History and Settings */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label='Recent Transcriptions' />
          <Tab label='Settings' />
        </Tabs>

        {selectedTab === 0 && (
          <Box sx={{ mt: 2 }}>
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
                                  item.timestamp
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
                No transcription history yet. Start recording to
                create your first transcription!
              </Typography>
            )}
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Settings panel - Coming soon!
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mt: 1 }}>
              Future features:
            </Typography>
            <ul>
              <li>Language selection</li>
              <li>Audio quality settings</li>
              <li>Transcription model selection</li>
              <li>Auto-send on completion</li>
            </ul>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SpeechToTextContainer;
