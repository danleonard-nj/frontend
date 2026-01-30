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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
} from '../../store/speechToText/speechToTextSlice';
import {
  transcribeAudio,
  transcribeFile,
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

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const handleMessageChange = (event) => {
    dispatch(setMessage(event.target.value));
    dispatch(clearError());
  };

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  const handleCopyToClipboard = async () => {
    if (!message.trim()) return;

    try {
      await navigator.clipboard.writeText(message);
      console.log('Message copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  /**
   * Process the recorded audio by sending it to the backend for transcription
   */
  const processRecordedAudio = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      console.warn('No audio chunks to process');
      return;
    }

    try {
      // Combine all audio chunks into a single blob
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm;codecs=opus',
      });

      console.log('Processing audio blob:', {
        size: audioBlob.size,
        type: audioBlob.type,
        chunkCount: audioChunksRef.current.length,
      });

      // Clear the chunks
      audioChunksRef.current = [];

      // Send to backend for transcription
      const result = await dispatch(transcribeAudio(audioBlob));
      console.log('Transcription result:', result);
    } catch (error) {
      console.error('Transcription error:', error);
    }
  }, [dispatch]);

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
        console.error('MediaRecorder error:', event.error);
        stopRecording();
      };

      // Start recording - no timeslice parameter means single chunk
      mediaRecorder.start();
      dispatch(setIsRecording(true));
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert(
        'Microphone access is required for voice input. Please grant permission and try again.'
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
          'Please upload a valid audio file (MP3, WAV, WEBM, OGG, M4A)'
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
        await dispatch(transcribeFile(file));
      } catch (error) {
        console.error('File upload error:', error);
      }

      // Clear the input so the same file can be uploaded again
      event.target.value = '';
    },
    [dispatch]
  );

  // Load transcription history on mount
  useEffect(() => {
    console.log('Loading transcription history on mount...');
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
            )}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 },
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
              No transcription history yet. Start recording to create
              your first transcription!
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
              No transcription history yet. Start recording to create
              your first transcription!
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SpeechToTextContainer;
