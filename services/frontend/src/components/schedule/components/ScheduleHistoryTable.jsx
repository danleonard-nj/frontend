import { Box, Grid, styled } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  scheduleHistoryColumns,
  transformScheduleHistoryData,
} from '../../../api/helpers/scheduleHelpers';

const TableContainer = styled(Box)(({ theme }) => ({
  height: '60vh',
  width: '100%',
}));

const HistoryTable = ({ rows, columns, loading }) => {
  const [data, setData] = React.useState([]);

  useEffect(() => {
    const records = transformScheduleHistoryData(rows);
    setData(records);
  }, [rows]);

  return (
    <TableContainer>
      <DataGrid
        rows={data}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        loading={loading}
      />
    </TableContainer>
  );
};

const ScheduleHistoryTable = () => {
  const { scheduleHistory = [], scheduleHistoryLoading = true } =
    useSelector((x) => x.schedule);

  return (
    <Grid>
      <HistoryTable
        rows={scheduleHistory}
        columns={scheduleHistoryColumns}
        loading={scheduleHistoryLoading}
      />
    </Grid>
  );
};

export { ScheduleHistoryTable };
