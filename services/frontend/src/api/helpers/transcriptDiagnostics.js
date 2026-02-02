/**
 * Diagnostic Utilities for Transcript Bolding Issues
 *
 * Use these to debug timing and bolding problems.
 */

/**
 * Check if backend segment timings are valid
 *
 * @param {Array} segments - Segments from backend
 * @returns {Object} Validation results with warnings
 */
export const validateSegmentTimings = (segments) => {
  const warnings = [];
  const errors = [];

  if (!segments || segments.length === 0) {
    return { valid: true, warnings: [], errors: [] };
  }

  segments.forEach((segment, index) => {
    // Check for missing or invalid times
    if (
      typeof segment.start !== 'number' ||
      typeof segment.end !== 'number'
    ) {
      errors.push(
        `Segment ${index}: Invalid start/end type (must be numbers)`,
      );
    }

    // Check for negative times
    if (segment.start < 0 || segment.end < 0) {
      errors.push(
        `Segment ${index}: Negative time values (start: ${segment.start}, end: ${segment.end})`,
      );
    }

    // Check if end comes before start
    if (segment.end <= segment.start) {
      errors.push(
        `Segment ${index}: End time (${segment.end}) must be after start time (${segment.start})`,
      );
    }

    // Check for very short segments (might cause bolding issues)
    const duration = segment.end - segment.start;
    if (duration < 0.1) {
      warnings.push(
        `Segment ${index}: Very short duration (${duration.toFixed(3)}s) - might appear to bold instantly`,
      );
    }

    // Check for gaps between segments
    if (index > 0) {
      const prevSegment = segments[index - 1];
      const gap = segment.start - prevSegment.end;

      if (gap < 0) {
        warnings.push(
          `Segments ${index - 1} and ${index}: Overlap detected (${Math.abs(gap).toFixed(2)}s)`,
        );
      } else if (gap > 5) {
        warnings.push(
          `Segments ${index - 1} and ${index}: Large gap (${gap.toFixed(2)}s) - may cause no active segment`,
        );
      }
    }

    // Check if segment has text
    if (!segment.text || segment.text.trim().length === 0) {
      warnings.push(
        `Segment ${index}: Empty or whitespace-only text`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    warnings,
    errors,
    segmentCount: segments.length,
    totalDuration: segments[segments.length - 1]?.end || 0,
  };
};

/**
 * Log detailed bolding state for debugging
 * Call this in your component when bolding seems off
 *
 * @param {Object} segment - Current segment
 * @param {number} currentTime - Current audio time
 * @param {number} displayTime - Throttled display time
 * @param {number} activeIndex - Active segment index
 */
export const logBoldingState = (
  segment,
  currentTime,
  displayTime,
  activeIndex,
) => {
  if (!segment) {
    console.warn('[Bolding Debug] No segment provided');
    return;
  }

  const duration = segment.end - segment.start;
  const elapsed = currentTime - segment.start;
  const progress = elapsed / duration;
  const timeDiff = currentTime - displayTime;

  console.group('🎯 Bolding Debug Info');
  console.log('Active Index:', activeIndex);
  console.log('Segment:', segment.speaker || 'Unknown');
  console.log(
    'Time Range:',
    `${segment.start.toFixed(2)}s - ${segment.end.toFixed(2)}s`,
  );
  console.log('Duration:', `${duration.toFixed(2)}s`);
  console.log('---');
  console.log('Current Time:', `${currentTime.toFixed(3)}s`);
  console.log('Display Time:', `${displayTime.toFixed(3)}s`);
  console.log(
    'Time Diff (throttle lag):',
    `${(timeDiff * 1000).toFixed(1)}ms`,
  );
  console.log('---');
  console.log('Elapsed in Segment:', `${elapsed.toFixed(2)}s`);
  console.log('Progress:', `${(progress * 100).toFixed(1)}%`);
  console.log('---');
  console.log('Text Length:', segment.text.length, 'chars');
  console.log(
    'Word Count:',
    segment.text.split(/\s+/).filter((w) => w).length,
    'words',
  );
  console.groupEnd();

  // Return values for further debugging
  return {
    duration,
    elapsed,
    progress,
    timeDiff,
    isLagging: Math.abs(timeDiff) > 0.1, // >100ms lag
  };
};

/**
 * Test bolding at different progress points
 *
 * @param {string} text - Segment text
 * @param {Array} progressPoints - Array of progress values (0.0 to 1.0)
 */
export const testBoldingProgression = (
  text,
  progressPoints = [0, 0.25, 0.5, 0.75, 1],
) => {
  // Import the function dynamically to avoid circular dependency
  const { getBoldedText } = require('./transcriptHelpers');

  console.group('🔤 Bolding Progression Test');
  console.log('Text:', text);
  console.log('Length:', text.length, 'chars');
  console.log('Words:', text.split(/\s+/).filter((w) => w).length);
  console.log('---');

  progressPoints.forEach((progress) => {
    const result = getBoldedText(text, progress);
    console.log(`Progress ${(progress * 100).toFixed(0)}%:`);
    console.log('  Bold:', `"${result.boldPart}"`);
    console.log('  Normal:', `"${result.normalPart}"`);
    console.log(
      '  Total:',
      result.boldPart.length + result.normalPart.length,
      '/',
      text.length,
    );
  });

  console.groupEnd();
};

/**
 * Check audio sync accuracy
 * Call this periodically during playback
 *
 * @param {HTMLAudioElement} audioElement - Audio element ref
 * @param {number} reduxTime - Current time from Redux
 */
export const checkAudioSync = (audioElement, reduxTime) => {
  if (!audioElement) {
    console.warn('[Audio Sync] No audio element');
    return null;
  }

  const actualTime = audioElement.currentTime;
  const drift = actualTime - reduxTime;
  const driftMs = drift * 1000;

  const result = {
    actualTime,
    reduxTime,
    drift,
    driftMs,
    isSynced: Math.abs(driftMs) < 100, // Within 100ms is acceptable
  };

  if (Math.abs(driftMs) > 200) {
    console.warn('[Audio Sync] Significant drift detected:', {
      actual: actualTime.toFixed(3),
      redux: reduxTime.toFixed(3),
      drift: `${driftMs.toFixed(1)}ms`,
    });
  }

  return result;
};

/**
 * Analyze segment timing quality from backend
 *
 * @param {Array} segments - Segments from backend response
 */
export const analyzeBackendTiming = (segments) => {
  const validation = validateSegmentTimings(segments);

  console.group('📊 Backend Timing Analysis');
  console.log('Segment Count:', validation.segmentCount);
  console.log(
    'Total Duration:',
    validation.totalDuration.toFixed(2),
    's',
  );
  console.log('Valid:', validation.valid ? '✅' : '❌');

  if (validation.errors.length > 0) {
    console.group('❌ Errors:');
    validation.errors.forEach((err) => console.error(err));
    console.groupEnd();
  }

  if (validation.warnings.length > 0) {
    console.group('⚠️ Warnings:');
    validation.warnings.forEach((warn) => console.warn(warn));
    console.groupEnd();
  }

  // Calculate statistics
  const durations = segments.map((s) => s.end - s.start);
  const avgDuration =
    durations.reduce((a, b) => a + b, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  console.log('---');
  console.log('Duration Stats:');
  console.log('  Average:', avgDuration.toFixed(2), 's');
  console.log('  Min:', minDuration.toFixed(2), 's');
  console.log('  Max:', maxDuration.toFixed(2), 's');

  console.groupEnd();

  return validation;
};

/**
 * Quick diagnostic - add this to your DiarizedTranscript component
 *
 * useEffect(() => {
 *   if (segments) {
 *     window.transcriptDebug = {
 *       validateTimings: () => analyzeBackendTiming(segments),
 *       testBolding: (text) => testBoldingProgression(text || segments[0]?.text),
 *       logState: () => logBoldingState(segments[activeIndex], currentTime, displayTime, activeIndex),
 *       checkSync: () => checkAudioSync(audioRef.current, currentTime),
 *     };
 *     console.log('💡 Transcript diagnostics available at: window.transcriptDebug');
 *   }
 * }, [segments]);
 *
 * Then in browser console:
 * - window.transcriptDebug.validateTimings()
 * - window.transcriptDebug.testBolding()
 * - window.transcriptDebug.logState()
 * - window.transcriptDebug.checkSync()
 */
