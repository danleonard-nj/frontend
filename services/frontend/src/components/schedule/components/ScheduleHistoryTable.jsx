import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getScheduleHistoryDisplayDateTime } from '../../../api/helpers/scheduleHelpers';

const ScheduleHistoryTable = () => {
  const scheduleHistory = useSelector((x) => x.schedule.scheduleHistory) ?? [];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Manual Trigger</TableCell>
            <TableCell>Schedule Name</TableCell>
            <TableCell>Schedule ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scheduleHistory.map((row) => (
            <TableRow key={row.scheduleId}>
              <TableCell>
                {getScheduleHistoryDisplayDateTime(row.createdDate)}
              </TableCell>
              <TableCell>{row.isManualTrigger}</TableCell>
              <TableCell>{row.scheduleName}</TableCell>
              <TableCell>{row.scheduleId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { ScheduleHistoryTable };
