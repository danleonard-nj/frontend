import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

/**
 * Reusable audio player component with play/pause and seek controls.
 *
 * @param {Object} props
 * @param {string} props.audioUrl - URL or blob URL of the audio to play
 * @param {function} props.onTimeUpdate - Optional callback when time updates (currentTime)
 * @param {function} props.onLoadedMetadata - Optional callback when metadata loads (duration)
 * @param {boolean} props.disabled - Whether controls are disabled
 * @param {boolean} props.compact - Use compact styling (smaller, inline)
 * @param {string} props.size - Size of play button: 'small' | 'medium' | 'large'
 */
const AudioPlayer = ({
  audioUrl,
  onTimeUpdate,
  onLoadedMetadata,
  disabled = false,
  compact = false,
  size = 'medium',
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /**
   * Toggle play/pause
   */
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || disabled) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying, disabled]);

  /**
   * Handle seeking via slider
   */
  const handleSeek = useCallback(
    (event, newValue) => {
      if (!audioRef.current || disabled) return;
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    },
    [disabled],
  );

  /**
   * Format seconds to MM:SS or just seconds for compact mode
   */
  const formatTime = (seconds) => {
    if (compact) {
      return `${Math.floor(seconds)}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    const handleTimeUpdateInternal = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) onTimeUpdate(time);
    };

    const handleLoadedMetadataInternal = () => {
      const dur = audio.duration;
      setDuration(dur);
      if (onLoadedMetadata) onLoadedMetadata(dur);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdateInternal);
    audio.addEventListener(
      'loadedmetadata',
      handleLoadedMetadataInternal,
    );

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener(
        'timeupdate',
        handleTimeUpdateInternal,
      );
      audio.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadataInternal,
      );
    };
  }, [onTimeUpdate, onLoadedMetadata]);

  // Reset state when audio source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          px: 1.5,
          py: 0.5,
          minWidth: 250,
        }}>
        <IconButton
          onClick={togglePlayPause}
          size={size}
          disabled={disabled}
          color='primary'>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Slider
            value={currentTime}
            max={duration || 100}
            onChange={handleSeek}
            size='small'
            disabled={disabled}
          />
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ fontSize: '0.65rem' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
        </Box>
        <audio ref={audioRef} src={audioUrl} preload='metadata' />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        pb: 2,
        borderBottom: 1,
        borderColor: 'divider',
      }}>
      <IconButton
        onClick={togglePlayPause}
        color='primary'
        size={size}
        disabled={disabled}
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      <Box sx={{ flex: 1 }}>
        <Slider
          value={currentTime}
          max={duration || 100}
          onChange={handleSeek}
          disabled={disabled}
          aria-label='Audio timeline'
          sx={{ mb: 0.5 }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            typography: 'caption',
            color: 'text.secondary',
          }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </Box>
      </Box>

      <audio ref={audioRef} src={audioUrl} preload='metadata' />
    </Box>
  );
};

export default AudioPlayer;
