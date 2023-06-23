import { Paper, TextField } from '@mui/material';
import * as React from 'react';
import { stripLeadingNewLineChars } from '../../../api/helpers/chatGptHelpers';
import { ExpandedCompletionContentTable } from './ExpandedCompletionContentTable';

const getPredictionText = (row) => {
  const choices = row?.response?.response?.body?.choices;

  return choices?.length
    ? stripLeadingNewLineChars(choices[0]?.text)
    : '';
};

const CompletionRowContent = ({ row }) => {
  return (
    <Paper elevation={3} sx={{ margin: '1rem', padding: 2 }}>
      <ExpandedCompletionContentTable row={row} />
      <TextField
        label='Prompt'
        fullWidth
        value={row?.response?.request?.body?.prompt}
        inputProps={{ readOnly: true }}
        sx={{ marginTop: '2rem' }}
      />
      <TextField
        label='Response'
        fullWidth
        multiline
        value={getPredictionText(row)}
        inputProps={{ readOnly: true }}
        sx={{ marginTop: '1rem' }}
      />
    </Paper>
  );
};

export { CompletionRowContent };
