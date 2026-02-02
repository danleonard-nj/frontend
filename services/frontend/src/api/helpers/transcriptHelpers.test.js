/**
 * Test cases for transcript helper utilities
 *
 * Run with: npm test transcriptHelpers.test.js
 * Or just use this file as documentation for edge cases.
 */

import {
  formatTime,
  findActiveSegmentIndex,
  getBoldedText,
  getInitials,
  calculateSegmentProgress,
} from './transcriptHelpers';

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

describe('formatTime', () => {
  test('formats standard times correctly', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(125)).toBe('2:05');
    expect(formatTime(3661)).toBe('61:01');
  });

  test('handles invalid inputs', () => {
    expect(formatTime(NaN)).toBe('0:00');
    expect(formatTime(-5)).toBe('0:00');
  });

  test('handles floats', () => {
    expect(formatTime(82.5)).toBe('1:22');
    expect(formatTime(153.7)).toBe('2:33');
  });
});

describe('findActiveSegmentIndex - Binary Search', () => {
  const segments = [
    { start: 0, end: 10, speaker: 'A', text: 'First' },
    { start: 10, end: 20, speaker: 'B', text: 'Second' },
    { start: 20, end: 30, speaker: 'A', text: 'Third' },
    { start: 30, end: 40, speaker: 'C', text: 'Fourth' },
    { start: 40, end: 50, speaker: 'A', text: 'Fifth' },
  ];

  test('finds correct segment', () => {
    expect(findActiveSegmentIndex(segments, 5)).toBe(0);
    expect(findActiveSegmentIndex(segments, 15)).toBe(1);
    expect(findActiveSegmentIndex(segments, 25)).toBe(2);
    expect(findActiveSegmentIndex(segments, 35)).toBe(3);
    expect(findActiveSegmentIndex(segments, 45)).toBe(4);
  });

  test('handles exact boundaries', () => {
    expect(findActiveSegmentIndex(segments, 10)).toBe(1); // Start of second
    expect(findActiveSegmentIndex(segments, 20)).toBe(2); // Start of third
  });

  test('handles time outside segments', () => {
    expect(findActiveSegmentIndex(segments, -1)).toBe(-1);
    expect(findActiveSegmentIndex(segments, 51)).toBe(-1);
  });

  test('handles last segment inclusive end', () => {
    expect(findActiveSegmentIndex(segments, 50)).toBe(4); // End of last segment
  });

  test('handles empty segments', () => {
    expect(findActiveSegmentIndex([], 10)).toBe(-1);
    expect(findActiveSegmentIndex(null, 10)).toBe(-1);
  });

  test('handles overlapping segments (takes earliest)', () => {
    const overlapping = [
      { start: 0, end: 15, speaker: 'A', text: 'First' },
      { start: 10, end: 20, speaker: 'B', text: 'Overlapping' },
    ];
    expect(findActiveSegmentIndex(overlapping, 12)).toBe(0); // First match wins
  });

  test('performance with large transcript', () => {
    // Generate 1000 segments
    const largeSegments = Array.from({ length: 1000 }, (_, i) => ({
      start: i * 10,
      end: (i + 1) * 10,
      speaker: `Speaker ${i % 5}`,
      text: `Segment ${i}`,
    }));

    const start = performance.now();
    const result = findActiveSegmentIndex(largeSegments, 5555);
    const duration = performance.now() - start;

    expect(result).toBe(555);
    expect(duration).toBeLessThan(1); // Should be sub-millisecond with binary search
  });
});

describe('getBoldedText - Progressive Bolding', () => {
  test('bolds words progressively', () => {
    const text = 'Hello world everyone';

    const result0 = getBoldedText(text, 0);
    expect(result0.boldPart).toBe('');
    expect(result0.normalPart).toBe(text);

    const result50 = getBoldedText(text, 0.5);
    expect(result50.boldPart).toBe('Hello '); // ~50% of words

    const result100 = getBoldedText(text, 1);
    expect(result100.boldPart).toBe(text);
    expect(result100.normalPart).toBe('');
  });

  test('handles whitespace correctly', () => {
    const text = 'Hello   world   test';
    const result = getBoldedText(text, 0.5);

    // Should preserve whitespace in output
    expect(result.boldPart + result.normalPart).toBe(text);
  });

  test('handles very short segments', () => {
    const text = 'Quick';
    const result = getBoldedText(text, 0.5);

    // Should still work with single word
    expect(result.boldPart + result.normalPart).toBe(text);
  });

  test('handles empty or invalid text', () => {
    expect(getBoldedText('', 0.5)).toEqual({
      boldPart: '',
      normalPart: '',
    });
    expect(getBoldedText(null, 0.5)).toEqual({
      boldPart: '',
      normalPart: '',
    });
  });

  test('clamps progress to valid range', () => {
    const text = 'Test text';

    const resultNeg = getBoldedText(text, -0.5);
    expect(resultNeg.boldPart).toBe('');

    const resultOver = getBoldedText(text, 1.5);
    expect(resultOver.boldPart).toBe(text);
    expect(resultOver.normalPart).toBe('');
  });

  test('handles multiline text', () => {
    const text = 'First line\nSecond line\nThird line';
    const result = getBoldedText(text, 0.5);

    // Should preserve newlines
    expect(result.boldPart + result.normalPart).toBe(text);
  });
});

describe('getInitials', () => {
  test('extracts initials correctly', () => {
    expect(getInitials('Nathalie Hill')).toBe('NH');
    expect(getInitials('Marius Ciocirlan')).toBe('MC');
    expect(getInitials('John')).toBe('J');
  });

  test('handles missing or invalid names', () => {
    expect(getInitials('')).toBe('S');
    expect(getInitials(null)).toBe('S');
    expect(getInitials(undefined)).toBe('S');
  });

  test('handles extra whitespace', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD');
  });

  test('handles three+ word names', () => {
    expect(getInitials('John Q Public')).toBe('JQ'); // Takes first two
  });
});

describe('calculateSegmentProgress', () => {
  const segment = {
    start: 100,
    end: 200,
    speaker: 'Test',
    text: 'Text',
  };

  test('calculates progress correctly', () => {
    expect(calculateSegmentProgress(segment, 100)).toBe(0);
    expect(calculateSegmentProgress(segment, 150)).toBe(0.5);
    expect(calculateSegmentProgress(segment, 200)).toBe(1);
  });

  test('handles time before segment', () => {
    expect(calculateSegmentProgress(segment, 50)).toBe(0);
  });

  test('handles time after segment', () => {
    expect(calculateSegmentProgress(segment, 250)).toBe(1);
  });

  test('handles very short segments (<0.4s)', () => {
    const shortSegment = {
      start: 100,
      end: 100.3,
      speaker: 'Test',
      text: 'Quick',
    };

    // Should return 1 immediately for very short segments
    expect(calculateSegmentProgress(shortSegment, 100.1)).toBe(1);
  });

  test('handles invalid segments', () => {
    expect(calculateSegmentProgress(null, 100)).toBe(0);
  });
});

// ============================================================================
// INTEGRATION TEST SCENARIOS
// ============================================================================

describe('Integration - Full Playback Scenario', () => {
  test('simulates complete playback with all features', () => {
    const segments = [
      {
        start: 82.0,
        end: 102.0,
        speaker: 'Nathalie Hill',
        text: 'Absolutely. Our software integrates...',
      },
      {
        start: 153.0,
        end: 173.0,
        speaker: 'Marius Ciocirlan',
        text: "I'm curious about the security...",
      },
    ];

    // At time 90 (in first segment)
    let activeIndex = findActiveSegmentIndex(segments, 90);
    expect(activeIndex).toBe(0);

    let progress = calculateSegmentProgress(segments[0], 90);
    expect(progress).toBeCloseTo(0.4); // 8/20 seconds through

    let bolded = getBoldedText(segments[0].text, progress);
    expect(bolded.boldPart.length).toBeGreaterThan(0);
    expect(bolded.normalPart.length).toBeGreaterThan(0);

    // At time 160 (in second segment)
    activeIndex = findActiveSegmentIndex(segments, 160);
    expect(activeIndex).toBe(1);

    progress = calculateSegmentProgress(segments[1], 160);
    expect(progress).toBeCloseTo(0.35); // 7/20 seconds through

    bolded = getBoldedText(segments[1].text, progress);
    expect(bolded.boldPart.length).toBeGreaterThan(0);

    // At time 175 (after all segments)
    activeIndex = findActiveSegmentIndex(segments, 175);
    expect(activeIndex).toBe(-1); // No active segment
  });
});

describe('Edge Cases - Real World Scenarios', () => {
  test('handles missing speaker names', () => {
    const segments = [
      { start: 0, end: 10, text: 'No speaker provided' },
    ];

    // Component should default to "Speaker" and get initials "S"
    const initials = getInitials(segments[0].speaker);
    expect(initials).toBe('S');
  });

  test('handles segments with unicode characters', () => {
    const text = 'Hello 世界 🌍 こんにちは';
    const result = getBoldedText(text, 0.5);

    // Should handle unicode without crashing
    expect(result.boldPart + result.normalPart).toBe(text);
  });

  test('handles very long speaker names', () => {
    const longName =
      'Dr. Professor Sir John Quincy Public III Esquire';
    const initials = getInitials(longName);

    // Should only return first two initials
    expect(initials.length).toBe(2);
    expect(initials).toBe('DP');
  });
});
