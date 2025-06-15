// services/frontend/src/components/calendar/CalendarEventCreator.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  Send,
  Refresh,
  CloudUpload,
  Delete,
  Image as ImageIcon,
  Description,
} from '@mui/icons-material';
import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCalendarEvent } from '../../store/calendar/calendarActions';
import {
  setPrompt,
  setImages,
} from '../../store/calendar/calendarSlice';

const CalendarEventCreator = () => {
  const dispatch = useDispatch();
  const {
    prompt,
    isGenerating,
    images = [],
  } = useSelector((x) => x.calendar);

  const [localPrompt, setLocalPrompt] = useState(prompt || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const SUPPORTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_IMAGES = 1; // API only supports one image

  const handlePromptChange = (event) => {
    setLocalPrompt(event.target.value);
  };

  const validateFile = (file) => {
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, GIF, and WebP images are supported';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFiles = useCallback(
    async (files) => {
      setUploadError('');
      const fileArray = Array.from(files);

      // Only process the first file since API supports one image
      const file = fileArray[0];
      if (!file) return;

      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }

      try {
        const newImage = {
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          base64: await convertFileToBase64(file),
          preview: URL.createObjectURL(file),
        };

        // Clean up previous image's object URL if it exists
        if (images.length > 0 && images[0].preview) {
          URL.revokeObjectURL(images[0].preview);
        }

        // Replace existing image with new one
        dispatch(setImages([newImage]));

        if (fileArray.length > 1) {
          setUploadError(
            `Only one image is supported. Using "${file.name}".`
          );
        }
      } catch (error) {
        setUploadError('Failed to process image');
      }
    },
    [images, dispatch]
  );

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = useCallback(
    (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const imageFiles = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        event.preventDefault();
        processFiles(imageFiles);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const removeImage = (imageId) => {
    const imageToRemove = images.find((img) => img.id === imageId);
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    dispatch(setImages([]));
    setUploadError('');
  };

  const handleGenerate = () => {
    dispatch(setPrompt(localPrompt));
    dispatch(
      generateCalendarEvent({
        prompt: localPrompt,
        images: images.map((img) => ({
          name: img.name,
          type: img.type,
          base64: img.base64,
        })),
      })
    );
  };

  const handleRetry = () => {
    if (prompt || images.length > 0) {
      dispatch(
        generateCalendarEvent({
          prompt,
          images: images.map((img) => ({
            name: img.name,
            type: img.type,
            base64: img.base64,
          })),
        })
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleGenerate();
    }
  };

  const canGenerate =
    (localPrompt.trim() || images.length > 0) && !isGenerating;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom color='primary'>
          Create Calendar Event
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mb: 2 }}>
          Describe your event in natural language and/or upload
          images. We'll generate a calendar entry for you.
        </Typography>

        <Grid container spacing={2}>
          {/* Text Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label='Event Description'
              placeholder="e.g., 'Meeting with John tomorrow at 2 PM in the conference room to discuss project updates'"
              value={localPrompt}
              onChange={handlePromptChange}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              disabled={isGenerating}
              variant='outlined'
              helperText='Press Ctrl+Enter to generate • Paste images directly into this field'
            />
          </Grid>

          {/* Image Upload Area */}
          <Grid item xs={12}>
            <Paper
              variant='outlined'
              sx={{
                p: 2,
                border: isDragOver
                  ? '2px dashed #1976d2'
                  : '2px dashed #e0e0e0',
                backgroundColor: isDragOver
                  ? '#f3f8ff'
                  : 'transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}>
              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                gap={1}>
                <CloudUpload
                  sx={{
                    fontSize: 40,
                    color: isDragOver ? '#1976d2' : '#9e9e9e',
                  }}
                />
                <Typography
                  variant='body2'
                  color='textSecondary'
                  align='center'>
                  {isDragOver
                    ? 'Drop image here...'
                    : 'Drag & drop an image here, or click to select a file'}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  Supports JPEG, PNG, GIF, WebP • Max 10MB • One image
                  at a time
                </Typography>
              </Box>
            </Paper>

            <input
              ref={fileInputRef}
              type='file'
              multiple
              accept={SUPPORTED_IMAGE_TYPES.join(',')}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </Grid>

          {/* Error Display */}
          {uploadError && (
            <Grid item xs={12}>
              <Alert
                severity='error'
                onClose={() => setUploadError('')}>
                {uploadError}
              </Alert>
            </Grid>
          )}

          {/* Image Preview */}
          {images.length > 0 && (
            <Grid item xs={12}>
              <Typography variant='subtitle2' gutterBottom>
                <ImageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Uploaded Image
              </Typography>
              <Box display='flex' gap={2} flexWrap='wrap'>
                {images.slice(0, 1).map((image) => (
                  <Box key={image.id} position='relative'>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 120,
                      }}>
                      <img
                        src={image.preview}
                        alt={image.name}
                        style={{
                          width: 100,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                      <Typography
                        variant='caption'
                        noWrap
                        sx={{
                          width: 100,
                          textAlign: 'center',
                          mt: 0.5,
                        }}>
                        {image.name}
                      </Typography>
                      <Chip
                        label={`${(image.size / 1024).toFixed(0)}KB`}
                        size='small'
                        variant='outlined'
                        sx={{ mt: 0.5 }}
                      />
                    </Paper>
                    <IconButton
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'error.light',
                        },
                      }}>
                      <Delete fontSize='small' />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box display='flex' gap={1} justifyContent='flex-end'>
              {prompt && (
                <Button
                  variant='outlined'
                  onClick={handleRetry}
                  disabled={isGenerating}
                  startIcon={<Refresh />}>
                  Retry
                </Button>
              )}
              <Button
                variant='contained'
                color='primary'
                onClick={handleGenerate}
                disabled={!canGenerate}
                startIcon={
                  isGenerating ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Send />
                  )
                }>
                {isGenerating ? 'Generating...' : 'Generate Event'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { CalendarEventCreator };
