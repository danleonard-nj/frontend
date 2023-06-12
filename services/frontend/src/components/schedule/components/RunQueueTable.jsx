import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getScheduleHistoryDisplayDateTime } from '../../../api/helpers/scheduleHelpers';
import DashboardTitle from '../../dashboard/DashboardTitle';
import Spinner from '../../Spinner';

const QueueTablePaper = styled(Paper)({
  minHeight: '16rem',
});

const RunQueueTable = () => {
  const { scheduleFetching = false, schedule = {} } = useSelector(
    (x) => x.schedule
  );

  return (
    <>
      <QueueTablePaper>
        <>
          <Box>
            <DashboardTitle>Queue</DashboardTitle>
          </Box>
          {scheduleFetching ? (
            <Spinner />
          ) : (
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
          )}
        </>
      </QueueTablePaper>
    </>
  );
};

export { RunQueueTable };
