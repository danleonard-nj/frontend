import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import * as React from 'react';
import { stripLeadingNewLineChars } from '../../../api/helpers/chatGptHelpers';

const getPredictionText = (row) => {
  const choices = row?.response?.response?.body?.choices;

  return choices?.length
    ? stripLeadingNewLineChars(choices[0]?.text)
    : '';
};

const ExpandedCompletionContentTable = ({ row }) => {
  return (
    <Table>
      <TableHead>
        <TableCell>Endpoint</TableCell>
        <TableCell>Bk</TableCell>
        <TableCell>Created</TableCell>
        <TableCell>Model</TableCell>
        <TableCell>Prompt Tokens</TableCell>
        <TableCell>Completion Tokens</TableCell>
        <TableCell>Total Tokens</TableCell>
        <TableCell>Duration</TableCell>
      </TableHead>
      <TableBody>
        <TableRow hover key={row.history_id}>
          <TableCell>{row.endpoint}</TableCell>
          <TableCell>{row.response?.response?.body?.id}</TableCell>
          <TableCell>
            {row.response?.response?.body?.created}
          </TableCell>
          <TableCell>{row.response?.response?.body?.model}</TableCell>
          <TableCell>
            {row.response?.response?.body?.usage?.prompt_tokens}
          </TableCell>
          <TableCell>
            {row.response?.response?.body?.usage?.completion_tokens}
          </TableCell>
          <TableCell>
            {row.response?.response?.body?.usage?.total_tokens}
          </TableCell>
          <TableCell>{row.response?.stats?.duration}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export { ExpandedCompletionContentTable };
