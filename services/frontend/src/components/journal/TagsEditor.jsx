import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LocalOffer } from '@mui/icons-material';
import { journalActions } from '../../store/journal/journalActions';

/**
 * Editable tag list for a journal entry.
 *
 * - Autocomplete from the global list of tags (loaded once per session).
 * - Free-form entries supported (creates a new tag on commit).
 * - Tags are normalized (trimmed, deduped) before being persisted.
 *
 * Persists changes via PATCH /api/journal/entries/<id> and updates the
 * Redux store so the entries list and global tag list stay in sync.
 */
export default function TagsEditor({ entryId, tags }) {
  const dispatch = useDispatch();
  const allTags = useSelector((s) => s.journal.tags);
  const [value, setValue] = useState(() =>
    Array.isArray(tags) ? tags : [],
  );
  const [saving, setSaving] = useState(false);

  // Keep local value in sync if the entry's tags change externally
  // (e.g. after a successful save or when switching entries).
  useEffect(() => {
    setValue(Array.isArray(tags) ? tags : []);
  }, [tags, entryId]);

  // Lazily fetch the global tag list once.
  useEffect(() => {
    if (allTags.length === 0) {
      dispatch(journalActions.loadTags());
    }
  }, [dispatch, allTags.length]);

  const options = useMemo(() => {
    // Combine global suggestions with whatever is currently selected
    // so the user can see both their tags and others' tags as choices.
    const set = new Set(allTags);
    for (const t of value) set.add(t);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allTags, value]);

  const tagsEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
  };

  const persist = async (next) => {
    if (!entryId) return;
    if (tagsEqual(next, Array.isArray(tags) ? tags : [])) return;
    setSaving(true);
    try {
      await dispatch(journalActions.patchEntryTags(entryId, next));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (_, raw) => {
    // Normalize: trim, drop empties, dedupe (case-insensitive).
    const seen = new Set();
    const next = [];
    for (const t of raw) {
      const trimmed = (typeof t === 'string' ? t : '').trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      next.push(trimmed);
    }
    setValue(next);
    persist(next);
  };

  return (
    <Box>
      <Stack
        direction='row'
        alignItems='center'
        spacing={1}
        sx={{ mb: 1 }}>
        <LocalOffer fontSize='small' color='action' />
        <Typography variant='subtitle2'>Tags</Typography>
        {saving && <CircularProgress size={14} />}
      </Stack>
      <Autocomplete
        multiple
        freeSolo
        size='small'
        options={options}
        value={value}
        onChange={handleChange}
        filterSelectedOptions
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              size='small'
              label={option}
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder='Add a tag…'
            variant='outlined'
          />
        )}
      />
    </Box>
  );
}
