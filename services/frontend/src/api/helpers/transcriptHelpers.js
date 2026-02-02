/**
 * Transcript Helper Utilities
 *
 * Provides efficient utilities for managing diarized transcripts with
 * Teams-style progressive bolding and binary search for active segment detection.
 */

/**
 * Format time in seconds to MM:SS format
 *
 * @param {number} seconds - Time in seconds (can be float)
 * @returns {string} Formatted time string (e.g., "1:42", "0:05", "12:34")
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Find the active segment index using binary search
 *
 * This is critical for performance with large transcripts (100+ segments).
 * Linear search on every timeupdate would be O(n) * updates/sec, which
 * could cause lag. Binary search reduces this to O(log n).
 *
 * @param {Array} segments - Array of segment objects with start and end times
 * @param {number} currentTime - Current playback time in seconds
 * @returns {number} Index of active segment, or -1 if none active
 *
 * A segment is considered "active" when:
 * currentTime >= segment.start && currentTime < segment.end
 */
export const findActiveSegmentIndex = (segments, currentTime) => {
  if (!segments || segments.length === 0) return -1;
  if (currentTime < 0) return -1;

  // Binary search for the segment containing currentTime
  let left = 0;
  let right = segments.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const segment = segments[mid];

    // Check if currentTime falls within this segment
    if (currentTime >= segment.start && currentTime < segment.end) {
      return mid;
    }

    // If currentTime is before this segment, search left half
    if (currentTime < segment.start) {
      right = mid - 1;
    }
    // If currentTime is after this segment, search right half
    else {
      left = mid + 1;
    }
  }

  // Edge case: check if we're in the very last segment
  // (handle inclusive end time for last segment)
  const lastSegment = segments[segments.length - 1];
  if (
    currentTime >= lastSegment.start &&
    currentTime <= lastSegment.end
  ) {
    return segments.length - 1;
  }

  return -1; // Not in any segment
};

/**
 * Generate bolded text based on progress through a segment (word-based)
 *
 * This creates the "karaoke-style" progressive bolding effect where
 * words are bolded as they're spoken. Word-based splitting looks
 * more natural than character-based bolding.
 *
 * @param {string} text - The segment text to process
 * @param {number} progress - Progress through segment (0.0 to 1.0)
 * @returns {Object} Object with 'boldPart' and 'normalPart' strings
 *
 * Example:
 * getBoldedText("Hello world everyone", 0.5)
 * => { boldPart: "Hello world", normalPart: "everyone" }
 */
export const getBoldedText = (text, progress) => {
  if (!text || typeof text !== 'string') {
    return { boldPart: '', normalPart: '' };
  }

  // Clamp progress to valid range
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // For very short segments (<0.4s duration), bold everything when active
  // This prevents flickering on single-word utterances
  if (clampedProgress > 0.99) {
    return { boldPart: text, normalPart: '' };
  }

  if (clampedProgress < 0.01) {
    return { boldPart: '', normalPart: text };
  }

  // Split text into words (handles multiple spaces, tabs, newlines)
  const words = text.split(/(\s+)/).filter((part) => part.length > 0);

  if (words.length === 0) {
    return { boldPart: '', normalPart: text };
  }

  // Calculate how many words should be bolded
  // Count only non-whitespace words for progress calculation
  const nonWhitespaceWords = words.filter((w) => !/^\s+$/.test(w));
  const boldWordCount = Math.floor(
    nonWhitespaceWords.length * clampedProgress,
  );

  // Reconstruct text with proper whitespace preservation
  let boldPart = '';
  let normalPart = '';
  let nonWhitespaceCount = 0;

  for (const part of words) {
    const isWhitespace = /^\s+$/.test(part);

    if (!isWhitespace) {
      nonWhitespaceCount++;
    }

    // Add to boldPart only if we haven't exceeded the bold word count
    // For whitespace, only include it if the NEXT word will be bolded
    if (nonWhitespaceCount <= boldWordCount) {
      boldPart += part;
    } else {
      normalPart += part;
    }
  }

  return { boldPart, normalPart };
};

/**
 * Get initials from a speaker name for avatar display
 *
 * @param {string} speakerName - Full speaker name (e.g., "Nathalie Hill")
 * @returns {string} Initials (e.g., "NH"), max 2 characters
 */
export const getInitials = (speakerName) => {
  if (!speakerName || typeof speakerName !== 'string') {
    return 'S'; // Default to 'S' for "Speaker"
  }

  const words = speakerName.trim().split(/\s+/);

  if (words.length === 0) return 'S';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  // Take first letter of first two words
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

/**
 * Calculate segment progress for progressive bolding
 *
 * @param {Object} segment - Segment with start and end times
 * @param {number} currentTime - Current playback time
 * @returns {number} Progress from 0.0 to 1.0
 */
export const calculateSegmentProgress = (segment, currentTime) => {
  if (!segment || currentTime < segment.start) return 0;
  if (currentTime >= segment.end) return 1;

  const duration = segment.end - segment.start;

  // Handle very short segments (less than 0.4 seconds)
  if (duration < 0.4) {
    return 1; // Bold entire segment immediately
  }

  const elapsed = currentTime - segment.start;
  const progress = elapsed / duration;

  return Math.max(0, Math.min(1, progress));
};

/**
 * Throttle function using requestAnimationFrame
 * Prevents excessive re-renders during audio playback
 *
 * @param {Function} callback - Function to throttle
 * @returns {Function} Throttled function
 */
export const throttleRAF = (callback) => {
  let rafId = null;
  let lastArgs = null;

  const throttled = (...args) => {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        callback(...lastArgs);
        rafId = null;
      });
    }
  };

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return throttled;
};
