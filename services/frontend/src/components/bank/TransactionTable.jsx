import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../api/helpers/bankHelpers';
import CheckIcon from '@mui/icons-material/Check';

const formatAmount = (amount) => {
  return amount < 0
    ? `+${formatCurrency(amount * -1)}`
    : formatCurrency(amount);
};

const formatType = (params) =>
  params.row.amount > 0 ? 'Debit' : 'Credit';

const getTableColumnConfig = (showPending) => {
  return [
    {
      field: 'transaction_date',
      headerName: 'Date',
      align: 'left',
      valueGetter: (params) =>
        new Date(params.value * 1000).toLocaleString(),
      flex: 0.25,
    },
    {
      field: 'transaction_bk',
      headerName: 'BK',
      align: 'left',
      flex: 0.25,
      hide: true,
    },
    {
      field: 'data',
      headerName: 'Merchant',
      align: 'left',
      valueGetter: (params) => params.row.merchant || '',
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
      flex: 0.5,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      align: 'left',
      valueGetter: (params) => formatAmount(params.value),
      flex: 0.15,
    },
    {
      field: 'pending',
      headerName: 'Pending',
      flex: 0.1,
      renderCell: (params) => {
        return params.value ? <CheckIcon /> : <></>;
      },
      hide: !showPending,
    },
    {
      field: 'type',
      headerName: 'Type',
      align: 'left',
      valueGetter: (params) => formatType(params),
      flex: 0.15,
    },
  ];
};

const TransactionTable = ({
  transactions,
  transactionsLoading,
  showPendingTransactions,
}) => {
  return (
    <Box height='60vh'>
      <DataGrid
        rows={transactions}
        columns={getTableColumnConfig(showPendingTransactions)}
        slots={{ toolbar: GridToolbar }}
        loading={transactionsLoading}
        getRowId={(row) => row.transaction_bk}
        getRowClassName={(params) =>
          params.row.pending
            ? 'transaction-table-highlighted-row'
            : ''
        }
      />
    </Box>
  );
};

export { TransactionTable };
