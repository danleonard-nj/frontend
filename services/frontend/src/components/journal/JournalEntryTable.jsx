import { Box, Paper, styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  tableColumns,
  transformJournalData,
} from '../../api/data/journal';

const TableContainer = styled(Box)(({ theme }) => ({
  height: '75vh',
  width: '100%',
}));

const JournalEntryTable = () => {
  const [data, setData] = useState([]);

  const {
    entries = [],
    entriesLoading = true,
    categories = [],
    categoriesLoading = true,
    units = [],
    unitsLoading = true,
  } = useSelector((x) => x.journal);

  useEffect(() => {
    setData(transformJournalData(entries, categories, units));
  }, [entries]);

  return (
    <TableContainer>
      <DataGrid
        rows={data}
        columns={tableColumns}
        loading={entriesLoading || categoriesLoading || unitsLoading}
      />
    </TableContainer>
  );
};

export { JournalEntryTable };
