import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { chatGptEndpoints } from '../../../api/data/chatGpt';
import { getLocalDateTimeFromTimestamp } from '../../../api/helpers/dateTimeUtils';
import { stripLeadingNewLineChars } from '../../../api/helpers/chatGptHelpers';
import { ImageRowContent } from './ImageRowContent';
import { CompletionRowContent } from './CompletionRowContent';

const ChatGptHistoryTable = ({ history }) => {
  const [expanded, setExpanded] = useState('');

  const handleExpandRow = (row) => {
    row.history_id === expanded
      ? setExpanded('')
      : setExpanded(row.history_id);
  };

  const ExpandButton = ({ isExpanded, row }) => {
    return (
      <IconButton
        aria-label='expand row'
        sx={{ margin: 'auto' }}
        onClick={() => handleExpandRow(row)}>
        {isExpanded ? (
          <KeyboardArrowUpIcon />
        ) : (
          <KeyboardArrowDownIcon />
        )}
      </IconButton>
    );
  };

  return (
    <Table size='small'>
      <TableHead>
        <TableCell />
        <TableCell>ID</TableCell>
        <TableCell>Date</TableCell>
        <TableCell>Endpoint</TableCell>
        <TableCell>Method</TableCell>
        <TableCell>Duration</TableCell>
      </TableHead>
      <TableBody>
        {history?.map((row, index) => (
          <>
            <TableRow hover key={index}>
              <TableCell>
                <ExpandButton
                  isExpanded={row.history_id === expanded}
                  row={row}
                />
              </TableCell>
              <TableCell>{row.history_id}</TableCell>
              <TableCell>
                {getLocalDateTimeFromTimestamp(row.created_date)}
              </TableCell>
              <TableCell>{row.endpoint}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell>
                {row.response?.stats?.duration ?? 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{ border: 0, paddingTop: 0, paddingBottom: 0 }}
                colSpan={12}>
                <Collapse
                  in={row.history_id === expanded}
                  timeout='auto'
                  unmountOnExit>
                  {row.endpoint ===
                    chatGptEndpoints.imageGenerations && (
                    <ImageRowContent row={row} />
                  )}
                  {row.endpoint === chatGptEndpoints.completions && (
                    <CompletionRowContent row={row} />
                  )}
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
};

export { ChatGptHistoryTable };
