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
import { getLocalDateTimeFromString } from '../../../api/helpers/dateTimeUtils';
import DashboardTitle from '../../dashboard/DashboardTitle';
import Spinner from '../../Spinner';

export default function RunQueueTable() {
  const scheduleFetching = useSelector((x) => x.schedule.scheduleFetching);
  const scheduleQueue = useSelector((x) => x.schedule?.schedule?.queue) ?? [];

  return (
    <>
      <Paper sx={{ minHeight: '16rem' }}>
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
                {scheduleQueue &&
                  scheduleQueue?.map((runtime, index) => (
                    <TableRow hover key={index}>
                      <TableCell>
                        {getLocalDateTimeFromString(runtime)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </>
      </Paper>
    </>
  );
}
