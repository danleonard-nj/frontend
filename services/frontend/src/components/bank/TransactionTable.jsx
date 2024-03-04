import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../api/helpers/bankHelpers';

const formatAmount = (amount) => {
  return amount < 0
    ? `+${formatCurrency(amount * -1)}`
    : formatCurrency(amount);
};

const columns = [
  {
    field: 'transaction_bk',
    headerName: 'ID',
    align: 'left',
    flex: 0.25,
  },
  {
    field: 'data',
    headerName: 'Merchant',
    align: 'left',
    valueGetter: (params) => params.row.merchant || '',
    flex: 0.25,
  },
  {
    field: 'transaction_date',
    headerName: 'Date',
    align: 'left',
    valueGetter: (params) =>
      new Date(params.value * 1000).toLocaleString(),
    flex: 0.25,
  },
  {
    field: 'categories',
    headerName: 'Categories',
    align: 'left',
    flex: 0.25,
  },
  {
    field: 'name',
    headerName: 'Description',
    align: 'left',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    align: 'left',
    valueGetter: (params) => formatAmount(params.value),
    flex: 0.15,
  },
];

const TransactionTable = () => {
  const { transactions = [], transactionsLoading = true } =
    useSelector((x) => x.bank);

  return (
    <Box height='60vh'>
      <DataGrid
        rows={transactions}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        loading={transactionsLoading}
        getRowId={(row) => row.transaction_bk}
      />
    </Box>
  );
};

export { TransactionTable };
