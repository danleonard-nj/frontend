import {
  Grid,
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
  const scheduleHistory =
    useSelector((x) => x.schedule.scheduleHistory) ?? [];

  return (
    <Grid>
      <TableContainer component={Paper}>
        <Table>
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
              <TableRow key={row.scheduleHistoryId}>
                <TableCell>
                  {getScheduleHistoryDisplayDateTime(row.createdDate)}
                </TableCell>
                <TableCell>
                  {row.isManualTrigger && true.toString()}
                </TableCell>
                <TableCell>{row.scheduleName}</TableCell>
                <TableCell>{row.scheduleId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export { ScheduleHistoryTable };
