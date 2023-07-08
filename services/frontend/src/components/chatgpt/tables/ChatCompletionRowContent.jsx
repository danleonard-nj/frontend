import { Paper, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { stripLeadingNewLineChars } from '../../../api/helpers/chatGptHelpers';
import { ExpandedCompletionContentTable } from './ExpandedCompletionContentTable';
import { GenericJsonEditor } from '../../GenericJsonEditor';

const getPredictionText = (row) => {
  const choices = row?.response?.response?.body?.choices;

  return choices?.length
    ? stripLeadingNewLineChars(choices[0]?.text)
    : '';
};

const ChatCompletionRowContent = ({ row }) => {
  return (
    <Paper elevation={3} sx={{ margin: '1rem', padding: 2 }}>
      <ExpandedCompletionContentTable row={row} />
      {/* <TextField
        label='Prompt'
        fullWidth
        value={row?.response?.request?.body?.prompt}
        inputProps={{ readOnly: true }}
        sx={{ marginTop: '2rem' }}
      /> */}
      <Typography
        variant='h6'
        gutterBottom
        sx={{ marginTop: '1rem ' }}>
        Outgoing
      </Typography>
      <GenericJsonEditor
        value={JSON.stringify(
          row?.response?.request?.body?.messages ?? {},
          null,
          2
        )}
      />
      <Typography
        variant='h6'
        gutterBottom
        sx={{ marginTop: '1rem ' }}>
        Inbound
      </Typography>

      <GenericJsonEditor
        value={JSON.stringify(
          row?.response?.response?.body?.choices ?? {},
          null,
          2
        )}
      />
      {/* <TextField
        label='Response'
        fullWidth
        multiline
        value={getPredictionText(row)}
        inputProps={{ readOnly: true }}
        sx={{ marginTop: '1rem' }}
      /> */}
    </Paper>
  );
};

export { ChatCompletionRowContent };
