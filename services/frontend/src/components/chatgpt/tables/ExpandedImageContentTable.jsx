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

const ExpandedImageContentTable = ({ row }) => {
  return (
    <Table>
      <TableHead>
        <TableCell>Endpoint</TableCell>
        <TableCell>Count</TableCell>
        <TableCell>Size</TableCell>
      </TableHead>
      <TableBody>
        <TableRow hover key={row.history_id}>
          <TableCell>{row.endpoint}</TableCell>
          <TableCell>{row.response?.request?.body?.n}</TableCell>
          <TableCell>{row.response?.request?.body?.n}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export { ExpandedImageContentTable };
