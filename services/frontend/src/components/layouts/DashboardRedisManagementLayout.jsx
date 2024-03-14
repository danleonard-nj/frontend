import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../api/helpers/formattingHelpers';
import {
  deleteRedisKey,
  getRedisKeys,
  getRedisValue,
  setSelectedRedisKey,
} from '../../store/redis/redisActions';
import { setParseJson } from '../../store/redis/redisSlice';
import { GenericJsonEditor } from '../GenericJsonEditor';
import Spinner from '../Spinner';

const secondsToString = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let timeString = '';

  if (hours > 0) {
    timeString += `${hours} hour(s) `;
  }
  if (minutes > 0) {
    timeString += `${minutes} minute(s) `;
  }
  if (remainingSeconds > 0) {
    timeString += `${remainingSeconds} second(s)`;
  }

  return timeString.trim(); // Trim any trailing whitespace
};

const RedisKeyListItem = ({ keyName, onClick }) => {
  const dispatch = useDispatch();

  const handleDeleteKey = (e) => {
    console.log('Deleting key', keyName);
    e.stopPropagation();
    e.preventDefault();
    dispatch(deleteRedisKey(keyName));
  };

  return (
    <ListItem>
      <ListItemButton onClick={onClick}>
        <Avatar
          sx={{
            bgcolor: blue[500],
            marginRight: '1rem',
          }}>
          K
        </Avatar>

        <ListItemText primary={keyName ?? ''} />

        <IconButton aria-label='comment' onClick={handleDeleteKey}>
          <DeleteIcon />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
};

const DashboardRedisManagementLayout = () => {
  const dispatch = useDispatch();
  const {
    redisKeys = [],
    redisKeysLoading = true,
    redisDiagnostics = {},
    redisDiagnosticsLoading,
    selectedKey = '',
    cacheValue = {},
    cacheValueLoading = false,
    parseJson = false,
  } = useSelector((x) => x.redis);

  const handleSelectKey = (key) => {
    dispatch(setSelectedRedisKey(key));
  };

  const handleSetParseJson = (e) => {
    dispatch(setParseJson(e.target.checked));
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
      dispatch(getRedisValue(selectedKey, parseJson));
    }
  }, [selectedKey, parseJson]);

  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Typography variant='h5'>Redis Management</Typography>
      </Grid>

      <Grid item lg={6} padding={2}>
        <Grid container spacing={3}>
          <Grid item lg={12} align='right'>
            <Button onClick={handleRefreshKeys}>Refresh</Button>
          </Grid>
          <Grid item lg={12}>
            {redisKeysLoading ? (
              <Spinner />
            ) : (
              <List component='nav' sx={scrollable}>
                {redisKeys.map((key, index) => (
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
      <Grid item lg={6}>
        <Grid container spacing={3}>
          <Grid item lg={6}>
            <FormGroup>
              <FormControlLabel
                disabled={!selectedKey}
                control={
                  <Switch
                    value={parseJson}
                    onChange={handleSetParseJson}
                  />
                }
                label='Parse JSON'
              />
            </FormGroup>
          </Grid>
          <Grid item align='right' lg={6}>
            <Button disabled={!selectedKey}>Delete</Button>
          </Grid>
          <Grid item lg={12}>
            <GenericJsonEditor
              value={JSON.stringify(cacheValue, null, '\t')}
            />
          </Grid>
          <Grid item lg={12}>
            <Typography variant='body2' align='right'>
              TTL: {secondsToString(cacheValue?.ttl ?? 0)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { DashboardRedisManagementLayout };
