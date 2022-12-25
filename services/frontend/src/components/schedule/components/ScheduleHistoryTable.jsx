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
            <TableCell>Schedule ID</TableCell>
            <TableCell>Schedule Name</TableCell>
            <TableCell>Task ID</TableCell>
            <TableCell>Task Name</TableCell>
            <TableCell>Manual Trigger</TableCell>
            <TableCell>Triggered</TableCell>
            <TableCell>Created Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scheduleHistory.map((row) => (
            <TableRow key={row.scheduleId}>
              <TableCell>{row.scheduleId}</TableCell>
              <TableCell>{row.scheduleName}</TableCell>
              <TableCell>{row.taskId}</TableCell>
              <TableCell>{row.taskName}</TableCell>
              <TableCell>{row.isManualTrigger}</TableCell>
              <TableCell>
                {getScheduleHistoryDisplayDateTime(row.triggerDate)}
              </TableCell>
              <TableCell>
                {getScheduleHistoryDisplayDateTime(row.createdDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { ScheduleHistoryTable };
