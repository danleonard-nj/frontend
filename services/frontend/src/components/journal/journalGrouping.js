/**
 * Groups entries into labelled buckets for the tree-view sidebar.
 * During search, returns a single flat "Results" group.
 */
export function bucketEntries(entries, searchValue) {
  const normalizedSearch = (searchValue || '').trim().toLowerCase();

  if (normalizedSearch) {
    const results = entries.filter((e) => {
      const haystack = `${e.date} ${e.title} ${e.time}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
    return results.length
      ? [{ label: 'Results', entries: results }]
      : [];
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const buckets = [
    { label: 'Today', maxDays: 1 },
    { label: 'Yesterday', maxDays: 2 },
    { label: 'This week', maxDays: 7 },
    { label: 'Last week', maxDays: 14 },
    { label: 'This month', maxDays: 30 },
    { label: 'Older', maxDays: Infinity },
  ];

  const groups = buckets.map((b) => ({
    label: b.label,
    entries: [],
  }));

  for (const entry of entries) {
    if (!entry.createdAt) {
      groups[groups.length - 1].entries.push(entry);
      continue;
    }
    const entryDate = new Date(entry.createdAt);
    const startOfEntryDay = new Date(
      entryDate.getFullYear(),
      entryDate.getMonth(),
      entryDate.getDate(),
    );
    const diffDays = Math.round(
      (startOfToday - startOfEntryDay) / (1000 * 60 * 60 * 24),
    );
    const idx = buckets.findIndex((b) => diffDays < b.maxDays);
    groups[idx >= 0 ? idx : groups.length - 1].entries.push(entry);
  }

  return groups.filter((g) => g.entries.length > 0);
}

/**
 * Format an ISO date (YYYY-MM-DD) for the Recent Moods list.
 */
export function formatDayLabel(isoDate) {
  if (!isoDate) return '';
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  if (isoDate === todayKey) return 'Today';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
