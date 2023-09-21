import { Grid, Box, styled } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';

const TableContainer = styled(Box)(({ theme }) => ({
  height: '60vh',
  width: '100%',
}));

const scheduleHistoryColumns = [
  {
    field: 'triggerDate',
    headerName: 'Date',
    align: 'left',
    valueGetter: (params) =>
      new Date(params.value * 1000).toLocaleString(),
    flex: 0.25,
  },
  {
    field: 'isManualTrigger',
    headerName: 'Manual Trigger',
    flex: 0.25,
    renderCell: (params) => {
      console.log(params);
      return params.value ? <CheckIcon /> : <></>;
    },
  },
  {
    field: 'scheduleName',
    headerName: 'Schedule Name',
    flex: 0.25,
  },
  {
    field: 'scheduleId',
    headerName: 'Schedule ID',
    flex: 0.25,
  },
];

const transformScheduleHistoryData = (scheduleHistory) => {
  return scheduleHistory.map((history) => ({
    id: history.scheduleHistoryId,
    ...history,
  }));
};

const HistoryTable = ({ rows, columns }) => {
  console.log('reloading');
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
      />
    </TableContainer>
  );
};

const ScheduleHistoryTable = () => {
  const scheduleHistory =
    useSelector((x) => x.schedule.scheduleHistory) ?? [];

  return (
    <Grid>
      <HistoryTable
        rows={scheduleHistory}
        columns={scheduleHistoryColumns}
      />
    </Grid>
  );
};

export { ScheduleHistoryTable };
