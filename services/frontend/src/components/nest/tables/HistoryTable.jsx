import { Box, styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { transformDeviceHistoryData } from '../../../api/data/nest';

const TableContainer = styled(Box)(({ theme }) => ({
  height: '75vh',
  width: '100%',
}));

const HistoryTable = ({ rows, columns, loading }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = transformDeviceHistoryData(rows);
    setData(data);
  }, [rows]);

  return (
    <TableContainer>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
      />
    </TableContainer>
  );
};

export { HistoryTable };
