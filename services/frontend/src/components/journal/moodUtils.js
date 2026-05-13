/**
 * Calculate mood color based on numeric score (0-10 scale)
 * @param {number} score - The mood score
 * @returns {string} - MUI color string
 */
export function moodTone(score) {
  // Use a numeric score (0-10 scale) to create a color gradient
  if (typeof score !== 'number') return 'text.disabled';

  if (score <= 2) {
    // Very negative - red
    return 'error.main';
  } else if (score <= 3) {
    // Negative/stressed - orange
    return 'warning.main';
  } else if (score <= 4) {
    // Below neutral - secondary
    return 'secondary.main';
  } else if (score <= 5) {
    // Neutral - grey
    return 'text.disabled';
  } else if (score <= 6) {
    // Slightly positive - secondary
    return 'secondary.main';
  } else if (score <= 7) {
    // Positive - info/cyan
    return 'info.main';
  } else if (score <= 8) {
    // Very positive - blue
    return 'primary.main';
  } else {
    // Extremely positive - green
    return 'success.main';
  }
}

/**
 * Safely extract a numeric mood score from an entry, regardless of
 * which shape the API/store delivered:
 *   - entry.mood is an object: `{ label, score }`
 *   - entry.mood is a number
 *   - entry.analysis.mood.score (when the entry has been hydrated
 *     from the detail endpoint)
 *
 * Returns `null` when no valid score is available — callers should
 * skip rendering in that case.
 */
export function getMoodScore(entry) {
  if (!entry) return null;
  const candidates = [
    entry.mood?.score,
    typeof entry.mood === 'number' ? entry.mood : undefined,
    entry.analysis?.mood?.score,
  ];
  for (const value of candidates) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}
