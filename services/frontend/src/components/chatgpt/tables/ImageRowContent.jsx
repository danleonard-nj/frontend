import { Paper, TextField } from '@mui/material';
import * as React from 'react';
import { ExpandedImageContentTable } from './ExpandedImageContentTable';
import { ExpandedImageList } from './ExpandedImageList';

const ImageRowContent = ({ row }) => {
  return (
    <Paper elevation={3} sx={{ margin: '1rem', padding: 2 }}>
      <ExpandedImageContentTable row={row} />
      <TextField
        label='Prompt'
        fullWidth
        value={row?.response?.request?.body?.prompt}
        inputProps={{ readOnly: false }}
        sx={{ marginTop: '2rem' }}
      />
      <ExpandedImageList images={row?.images ?? []} />
    </Paper>
  );
};

export { ImageRowContent };
