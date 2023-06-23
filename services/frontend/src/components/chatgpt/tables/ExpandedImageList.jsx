import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import * as React from 'react';

const ExpandedImageList = ({ images }) => {
  return (
    <List>
      {images.map((image, index) => (
        <ListItem key={index}>
          <ListItemButton href={image} target='_blank'>
            <ListItemText primary={image} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export { ExpandedImageList };
