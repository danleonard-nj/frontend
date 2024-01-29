import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import * as React from 'react';

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
