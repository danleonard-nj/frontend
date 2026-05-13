/**
 * Shared formatting helpers for journal components.
 */

/**
 * Format a byte count as a human-readable string (B / KB / MB).
 * Returns '' for null/undefined input.
 */
export function formatBytes(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format a date-like value using the user's locale. Returns '' on
 * invalid or missing input.
 */
export function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '';
  }
}
