import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import * as React from 'react';
import { getLocalDateTimeFromTimestamp } from '../../../api/helpers/dateTimeUtils';

const ChatGptHistoryGenericTable = ({ history }) => {
  console.log('history', history);
  return (
    <Table>
      <TableHead>
        <TableCell>History ID</TableCell>
        <TableCell>Date</TableCell>
        <TableCell>Endpoint</TableCell>
        <TableCell>Method</TableCell>
        <TableCell>Duration</TableCell>
        <TableCell />
      </TableHead>
      <TableBody>
        {history?.map((row, index) => (
          <TableRow hover key={index}>
            <TableCell>{row.history_id}</TableCell>
            <TableCell>
              {getLocalDateTimeFromTimestamp(row.created_date)}
            </TableCell>
            <TableCell>{row.endpoint}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell>
              {row.response?.stats?.duration ?? 0}
            </TableCell>
            <TableCell>
              <Button>View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { ChatGptHistoryGenericTable };
