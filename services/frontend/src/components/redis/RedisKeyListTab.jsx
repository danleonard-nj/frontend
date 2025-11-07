import {
  Box,
  Button,
  Chip,
  Grid,
  List,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../api/helpers/formattingHelpers';
import { secondsToString } from '../../api/helpers/redisHelpers';
import {
  getRedisKeys,
  getRedisValue,
  setSelectedRedisKey,
  setRedisValue,
  deleteRedisKey,
} from '../../store/redis/redisActions';
import { GenericJsonEditor } from '../GenericJsonEditor';
import Spinner from '../Spinner';
import { RedisKeyListItem } from './RedisKeyListItem';

const RedisKeyTab = () => {
  const dispatch = useDispatch();
  const {
    redisKeys = [],
    redisKeysLoading = true,
    selectedKey = '',
    cacheValue = {},
    cacheValueLoading = false,
  } = useSelector((x) => x.redis);

  const [search, setSearch] = useState('');
  const [editorText, setEditorText] = useState('');
  const [isJsonValue, setIsJsonValue] = useState(false);
  const [isJsonValid, setIsJsonValid] = useState(true);

  const handleSelectKey = (key) => {
    dispatch(setSelectedRedisKey(key));
  };

  const handleRefreshKeys = () => {
    dispatch(getRedisKeys());
  };

  useEffect(() => {
    console.log('Fetching Redis keys');
    dispatch(getRedisKeys());
  }, []);

  useEffect(() => {
    console.log('Selected key changed');
    if (selectedKey) {
      dispatch(getRedisValue(selectedKey, false));
    }
  }, [selectedKey]);

  // Derive a clean value string for the editor from cacheValue
  const derivedValueString = useMemo(() => {
    const raw = Object.prototype.hasOwnProperty.call(
      cacheValue,
      'value'
    )
      ? cacheValue.value
      : cacheValue;

    try {
      // Try to detect if it's JSON
      const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
      // If we got here, it's valid JSON
      setIsJsonValue(true);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      // Not JSON, treat as plain text
      setIsJsonValue(false);
      return typeof raw === 'string' ? raw : JSON.stringify(raw);
    }
  }, [cacheValue]);

  useEffect(() => {
    setEditorText(derivedValueString || '');
    setIsJsonValid(true);
  }, [derivedValueString]);

  const filteredKeys = useMemo(() => {
    return search
      ? redisKeys.filter((k) =>
          k.toLowerCase().includes(search.toLowerCase())
        )
      : redisKeys;
  }, [redisKeys, search]);

  const onEditorChange = (text) => {
    setEditorText(text);
    if (isJsonValue) {
      try {
        JSON.parse(text || 'null');
        setIsJsonValid(true);
      } catch (e) {
        setIsJsonValid(false);
      }
    } else {
      setIsJsonValid(true); // Plain text is always valid
    }
  };

  const handleSave = () => {
    if (!selectedKey) return;
    if (isJsonValue) {
      try {
        const obj = editorText ? JSON.parse(editorText) : null;
        dispatch(setRedisValue(selectedKey, obj, true));
      } catch (e) {
        // Invalid JSON; do nothing here as validation badge already shows
        return;
      }
    } else {
      dispatch(setRedisValue(selectedKey, editorText || '', false));
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedKey) return;
    const ok = window.confirm(
      `Delete key '${selectedKey}'? This cannot be undone.`
    );
    if (ok) {
      // Re-use per-item delete action; list will refresh via thunk
      // Dispatching here keeps UX consistent when user is viewing the value pane
      dispatch(deleteRedisKey(selectedKey));
    }
  };

  const handleBackToList = () => {
    dispatch(setSelectedRedisKey(''));
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text ?? '');
    } catch (e) {
      // ignore copy failures silently
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Left pane: Explorer */}
      <Grid
        item
        xs={12}
        md={5}
        padding={2}
        sx={{
          display: {
            xs: selectedKey ? 'none' : 'block',
            md: 'block',
          },
        }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <TextField
                fullWidth
                size='small'
                label='Search keys'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleRefreshKeys}>Refresh</Button>
            </Stack>
            <Typography variant='caption' color='text.secondary'>
              {filteredKeys.length} of {redisKeys.length} keys
            </Typography>
          </Grid>

          {/* Key list */}
          <Grid item xs={12}>
            {redisKeysLoading ? (
              <Spinner />
            ) : (
              <List component='nav' sx={scrollable}>
                {filteredKeys.map((key, index) => (
                  <RedisKeyListItem
                    key={`${key}-${index}`}
                    keyName={key}
                    onClick={() => handleSelectKey(key)}
                  />
                ))}
              </List>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Right pane: Viewer/Editor */}
      <Grid
        item
        xs={12}
        md={7}
        sx={{
          display: {
            xs: selectedKey ? 'block' : 'none',
            md: 'block',
          },
        }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction='row'
              spacing={2}
              alignItems='center'
              justifyContent='space-between'
              flexWrap='wrap'>
              <Stack direction='row' spacing={1} alignItems='center'>
                <Button
                  size='small'
                  onClick={handleBackToList}
                  sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
                  ← Back
                </Button>
                <Tooltip
                  title={
                    isJsonValue
                      ? isJsonValid
                        ? 'Valid JSON'
                        : 'Invalid JSON'
                      : 'Plain text'
                  }>
                  <Chip
                    size='small'
                    label={
                      isJsonValue
                        ? isJsonValid
                          ? 'JSON ✓'
                          : 'JSON ✗'
                        : 'Text'
                    }
                    color={
                      !isJsonValue
                        ? 'default'
                        : isJsonValid
                        ? 'success'
                        : 'error'
                    }
                  />
                </Tooltip>
              </Stack>
              <Stack direction='row' spacing={1} flexWrap='wrap'>
                <Button
                  variant='outlined'
                  size='small'
                  disabled={!selectedKey}
                  onClick={() => handleCopy(selectedKey)}>
                  Copy Key
                </Button>
                <Button
                  variant='outlined'
                  size='small'
                  disabled={!selectedKey}
                  onClick={() => handleCopy(editorText)}>
                  Copy Value
                </Button>
                <Button
                  color='error'
                  size='small'
                  disabled={!selectedKey}
                  onClick={handleDeleteSelected}>
                  Delete
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  disabled={
                    !selectedKey || (isJsonValue && !isJsonValid)
                  }
                  onClick={handleSave}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <GenericJsonEditor
              value={editorText}
              onChange={onEditorChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Typography variant='body2'>
                Selected: {selectedKey || '—'}
              </Typography>
              <Typography variant='body2' align='right'>
                TTL: {secondsToString(cacheValue?.ttl ?? 0)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { RedisKeyTab };
