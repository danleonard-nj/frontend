import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

const ChatGptImageList = () => {
  const images = useSelector((x) => x.chatgpt.images) ?? [];

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant='h6'>Images</Typography>
      <List>
        {images.map((image, index) => (
          <ListItem disablePadding>
            <ListItemButton href={image.url} target='_blank'>
              <ListItemText primary={`Image Result #${index + 1}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export { ChatGptImageList };
