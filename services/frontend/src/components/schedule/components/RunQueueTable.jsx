import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getScheduleHistoryDisplayDateTime } from '../../../api/helpers/scheduleHelpers';
import Spinner from '../../Spinner';
import DashboardTitle from '../../dashboard/DashboardTitle';

const RuntimeTable = ({ schedule }) => (
  <Table size='small'>
    <TableHead>
      <TableRow>
        <TableCell>Date</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {schedule?.queue &&
        schedule?.queue?.map((runtime, index) => (
          <TableRow hover key={index}>
            <TableCell>
              {getScheduleHistoryDisplayDateTime(runtime)}
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
);

const BackgroundPaper = ({ children }) => (
  <Paper sx={{ minHeight: '16rem' }}>{children}</Paper>
);

const RunQueueTable = () => {
  const { scheduleFetching = false, schedule = {} } = useSelector(
    (x) => x.schedule
  );

  return (
    <div>
      <BackgroundPaper>
        <Box>
          <DashboardTitle>Queue</DashboardTitle>
        </Box>
        {scheduleFetching ? (
          <Spinner />
        ) : (
          <RuntimeTable schedule={schedule} />
        )}
      </BackgroundPaper>
    </div>
  );
};

export { RunQueueTable };
