import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Avatar,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useDispatch } from 'react-redux';
import {
  setAudioCurrentTime,
  setActiveSegmentIndex,
} from '../../store/speechToText/speechToTextSlice';
import {
  formatTime,
  findActiveSegmentIndex,
  getBoldedText,
  getInitials,
  calculateSegmentProgress,
  throttleRAF,
} from '../../api/helpers/transcriptHelpers';
import {
  analyzeBackendTiming,
  logBoldingState,
  checkAudioSync,
  testBoldingProgression,
} from '../../api/helpers/transcriptDiagnostics';

/**
 * DiarizedTranscript Component - Teams-style transcript UI
 *
 * Displays speaker-diarized transcript with Microsoft Teams-style presentation.
 * Features:
 * - Teams-style card layout with speaker avatars
 * - Progressive word-by-word bolding during playback (karaoke effect)
 * - Binary search for efficient active segment detection
 * - Click-to-seek functionality
 * - Auto-scroll to keep active segment in view
 * - Keyboard navigation (Tab, Enter, Space)
 * - Accessibility support with ARIA labels
 *
 * Technical implementation:
 * - Uses binary search (O(log n)) instead of linear scan for segment lookup
 * - Throttles UI updates with requestAnimationFrame to prevent lag
 * - Memoizes formatted timestamps and word arrays per segment
 * - Progressive bolding based on segment progress (0.0 to 1.0)
 *
 * @param {Object} props
 * @param {string} props.audioUrl - URL of the audio file
 * @param {Array} props.segments - Array of diarized segments with start, end, speaker, text
 * @param {number} props.currentTime - Current playback time from Redux
 * @param {number} props.activeIndex - Currently active segment index from Redux
 */
const DiarizedTranscript = ({
  audioUrl,
  segments,
  currentTime,
  activeIndex,
}) => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const activeSegmentRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [displayTime, setDisplayTime] = useState(0); // Throttled display time

  /**
   * Memoize formatted timestamps for all segments
   * Only recomputes when segments array changes
   */
  const formattedTimestamps = useMemo(() => {
    if (!segments) return [];
    return segments.map((segment) => ({
      start: formatTime(segment.start),
      end: formatTime(segment.end),
    }));
  }, [segments]);

  /**
   * Memoize word arrays per segment for progressive bolding
   * Only recomputes when segments array changes
   */
  const segmentWords = useMemo(() => {
    if (!segments) return [];
    return segments.map((segment) =>
      segment.text.split(/(\s+)/).filter((part) => part.length > 0),
    );
  }, [segments]);

  /**
   * Throttled time update handler using requestAnimationFrame
   * Prevents excessive re-renders during playback
   */
  const throttledTimeUpdate = useMemo(
    () =>
      throttleRAF((time) => {
        setDisplayTime(time);
        dispatch(setAudioCurrentTime(time));
      }),
    [dispatch],
  );

  /**
   * Handle audio timeupdate event with binary search for active segment
   * Uses efficient O(log n) binary search instead of O(n) linear scan
   */
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current || !segments) return;

    const currentTime = audioRef.current.currentTime;

    // Throttle display updates to avoid lag
    throttledTimeUpdate(currentTime);

    // Use binary search to find active segment (efficient for large transcripts)
    const newActiveIndex = findActiveSegmentIndex(
      segments,
      currentTime,
    );

    // Only update Redux if active segment changed
    if (newActiveIndex !== activeIndex) {
      dispatch(setActiveSegmentIndex(newActiveIndex));
    }
  }, [segments, activeIndex, dispatch, throttledTimeUpdate]);

  /**
   * Handle when audio metadata is loaded (duration available)
   */
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  /**
   * Toggle play/pause
   */
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Handle seeking via timeline slider
   */
  const handleSeek = (event, newValue) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = newValue;
    dispatch(setAudioCurrentTime(newValue));
  };

  /**
   * Handle segment click - seek to segment start and resume playback
   */
  const handleSegmentClick = useCallback(
    (segment) => {
      if (!audioRef.current) return;

      audioRef.current.currentTime = segment.start;
      dispatch(setAudioCurrentTime(segment.start));

      // Resume playback if not already playing
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    },
    [dispatch, isPlaying],
  );

  /**
   * Handle keyboard navigation for segments
   * Enter or Space key triggers segment click
   */
  const handleSegmentKeyDown = useCallback(
    (event, segment) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSegmentClick(segment);
      }
    },
    [handleSegmentClick],
  );

  /**
   * Auto-scroll to active segment when it changes and is not fully visible
   * Only scrolls when segment changes and is near/off screen edge
   */
  useEffect(() => {
    if (
      !activeSegmentRef.current ||
      activeIndex < 0 ||
      !transcriptContainerRef.current
    ) {
      return;
    }

    const element = activeSegmentRef.current;
    const container = transcriptContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Check if element is within visible area of container
    const isFullyVisible =
      elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom;

    // Only scroll if the active segment is not fully visible or near edge
    if (!isFullyVisible) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  /**
   * Cleanup throttled function on unmount
   */
  useEffect(() => {
    return () => {
      throttledTimeUpdate.cancel?.();
    };
  }, [throttledTimeUpdate]);

  // Attach event listeners to audio element and handle ended event
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      // Clear active segment when audio ends
      dispatch(setActiveSegmentIndex(-1));
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch]);

  // Diagnostic tools for debugging bolding issues
  // Available in browser console as window.transcriptDebug
  useEffect(() => {
    if (segments && segments.length > 0) {
      window.transcriptDebug = {
        validateTimings: () => analyzeBackendTiming(segments),
        testBolding: (text) =>
          testBoldingProgression(text || segments[0]?.text),
        logState: () =>
          logBoldingState(
            segments[activeIndex],
            audioRef.current?.currentTime || 0,
            displayTime,
            activeIndex,
          ),
        checkSync: () =>
          checkAudioSync(audioRef.current, displayTime),
        segments, // Direct access to segments
      };
      console.log(
        '💡 Transcript diagnostics available: window.transcriptDebug',
      );
      console.log(
        '   • window.transcriptDebug.validateTimings() - Check backend timing issues',
      );
      console.log(
        '   • window.transcriptDebug.testBolding() - Test bolding progression',
      );
      console.log(
        '   • window.transcriptDebug.logState() - Log current bolding state',
      );
      console.log(
        '   • window.transcriptDebug.checkSync() - Check audio sync',
      );
    }
  }, [segments, activeIndex, displayTime]);

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography variant='h6' gutterBottom>
        Diarized Transcript
      </Typography>

      {/* Audio Player Controls */}
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
          size='large'
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <Slider
            value={displayTime}
            max={duration || 100}
            onChange={handleSeek}
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
            <span>{formatTime(displayTime)}</span>
            <span>{formatTime(duration)}</span>
          </Box>
        </Box>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          preload='metadata'
        />
      </Box>

      {/* Teams-style Transcript with Speaker Segments */}
      <Box
        ref={transcriptContainerRef}
        sx={{
          maxHeight: 500,
          overflowY: 'auto',
          overflowX: 'hidden',
          pr: 1,
        }}>
        {segments && segments.length > 0 ? (
          segments.map((segment, index) => {
            const isActive = index === activeIndex;
            const speakerName = segment.speaker || 'Speaker';
            const initials = getInitials(speakerName);

            // Calculate progress for progressive bolding
            let segmentProgress = 0;
            let boldPart = '';
            let normalPart = segment.text;

            if (
              isActive &&
              displayTime >= segment.start &&
              displayTime < segment.end
            ) {
              segmentProgress = calculateSegmentProgress(
                segment,
                displayTime,
              );
              const boldedText = getBoldedText(
                segment.text,
                segmentProgress,
              );
              boldPart = boldedText.boldPart;
              normalPart = boldedText.normalPart;
            }

            return (
              <Box
                key={index}
                ref={isActive ? activeSegmentRef : null}
                onClick={() => handleSegmentClick(segment)}
                onKeyDown={(e) => handleSegmentKeyDown(e, segment)}
                tabIndex={0}
                role='button'
                aria-label={`${speakerName} at ${formattedTimestamps[index]?.start}. ${segment.text}`}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  p: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  backgroundColor: isActive
                    ? 'rgba(96, 94, 92, 0.08)'
                    : 'transparent',
                  borderLeft: 4,
                  borderLeftColor: isActive
                    ? 'primary.main'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? 'rgba(96, 94, 92, 0.12)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  '&:focus': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '-2px',
                  },
                }}>
                {/* Speaker Avatar Circle */}
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    bgcolor: isActive
                      ? 'primary.main'
                      : 'action.selected',
                    color: isActive ? 'white' : 'text.primary',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                  {initials}
                </Avatar>

                {/* Content Column */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Speaker Name and Timestamp Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      mb: 0.5,
                      gap: 2,
                    }}>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        flexShrink: 0,
                      }}>
                      {speakerName}
                    </Typography>
                    <Typography
                      variant='caption'
                      component='span'
                      role='button'
                      aria-label={`Jump to ${formattedTimestamps[index]?.start}`}
                      sx={{
                        color: 'text.secondary',
                        flexShrink: 0,
                        fontSize: '0.75rem',
                      }}>
                      {formattedTimestamps[index]?.start}
                    </Typography>
                  </Box>

                  {/* Segment Text with Progressive Bolding */}
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'text.primary',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}>
                    {isActive && boldPart ? (
                      <>
                        <Box
                          component='span'
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                          }}>
                          {boldPart}
                        </Box>
                        {normalPart}
                      </>
                    ) : (
                      segment.text
                    )}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ textAlign: 'center', py: 3 }}>
            No segments available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default DiarizedTranscript;
