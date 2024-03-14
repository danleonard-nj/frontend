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
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import {
  getRedisKeys,
  getRedisValue,
  setSelectedRedisKey,
} from '../../store/redis/redisActions';
import { GenericJsonEditor } from '../GenericJsonEditor';
import {
  setParseJson,
  setSelectedKey,
} from '../../store/redis/redisSlice';
import { getAvatarColor } from '../../api/helpers/featureHelpers';
import { blue } from '@mui/material/colors';
import { scrollable } from '../../api/helpers/formattingHelpers';

const RedisKeyListItem = ({ keyName, onClick }) => {
  const handleDelete = () => {
    console.log('Deleting key', keyName);
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

        <IconButton aria-label='comment' onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
};

const DashboardRedisManagementLayout = () => {
  console.log('rendering DashboardRedisManagementLayout');
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

  console.log('selectedKey', selectedKey);

  const handleSelectKey = (key) => {
    console.log('handleSelectKey', key);
    dispatch(setSelectedRedisKey(key));
  };

  const handleSetParseJson = (e) => {
    dispatch(setParseJson(e.target.checked));
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
      <Grid item lg={6}>
        {redisKeysLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List component='nav' sx={scrollable}>
            {redisKeys.map((key, index) => (
              // <ListItem key={index}>
              //   <ListItemButton
              //     key={index}
              //     onClick={() => handleSelectKey(key)}>
              //     {key}
              //   </ListItemButton>
              // </ListItem>
              <RedisKeyListItem
                key={`${key}-${index}`}
                keyName={key}
                onClick={() => handleSelectKey(key)}
              />
            ))}
          </List>
        )}
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
          <GenericJsonEditor
            value={JSON.stringify(cacheValue, null, '\t')}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export { DashboardRedisManagementLayout };
