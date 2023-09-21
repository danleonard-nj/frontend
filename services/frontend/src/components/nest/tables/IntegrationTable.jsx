import { DataGrid } from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { transformIntegrationEventData } from '../../../api/data/nest';

const TableContainer = styled(Box)(({ theme }) => ({
  height: '75vh',
  width: '100%',
}));

const IntegrationTable = ({ rows, columns, loading }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = transformIntegrationEventData(rows);
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

export { IntegrationTable };
