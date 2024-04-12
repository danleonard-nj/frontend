import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteRedisKey } from '../../store/redis/redisActions';

const RedisKeyListItem = ({ keyName, onClick }) => {
  const dispatch = useDispatch();

  const handleDeleteKey = (e) => {
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

export { RedisKeyListItem };
