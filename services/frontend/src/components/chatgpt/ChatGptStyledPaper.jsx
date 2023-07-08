import { Paper } from '@mui/material';
import React from 'react';

const ChatGptStyledPaper = ({ el, children }) => {
  return (
    <Paper
      elevation={el}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Paper>
  );
};

export { ChatGptStyledPaper };
