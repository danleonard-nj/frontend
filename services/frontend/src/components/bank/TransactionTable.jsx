import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { formatCurrency } from '../../api/helpers/bankHelpers';

const pendingTransactionRowColor = '#55668C';
const depositRowColor = '#477D7D';

const getIsoDate = (date) => {
  return date.toISOString().split('T')[0];
};

const getIsoDateFromTimestamp = (timestamp) => {
  return getIsoDate(new Date(timestamp * 1000));
};

const formatPending = (pending) => {
  return pending ? 'True' : 'False';
};

const getTableRowStyles = (transaction) => ({
  backgroundColor: transaction.pending
    ? pendingTransactionRowColor
    : '',
});

const formatAmount = (amount) => {
  return amount < 0
    ? `+ ${formatCurrency(amount * -1)}`
    : formatCurrency(amount);
};

const CategoryTooltipContent = ({ transaction }) => {
  return (
    <>
      <span>Primary: {transaction?.pf_categories?.primary}</span>
      <br />
      <span>Detailed: {transaction?.pf_categories?.detailed}</span>
    </>
  );
};

const TransactionTable = ({ transactions }) => {
  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          {/* <TableCell>Transaction ID</TableCell> */}
          <TableCell>Date</TableCell>
          <TableCell>Categories</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>Amount</TableCell>
          {/* <TableCell>Modified</TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow sx={getTableRowStyles(transaction)}>
            {/* <TableCell>{transaction.transaction_id}</TableCell> */}
            <TableCell>
              {getIsoDateFromTimestamp(transaction.transaction_date)}
            </TableCell>
            <Tooltip
              title={
                <CategoryTooltipContent transaction={transaction} />
              }
              placement='left'>
              <TableCell>
                {(transaction.categories ?? []).join(', ')}
              </TableCell>
            </Tooltip>
            <TableCell>{transaction.name ?? 'N/A'}</TableCell>
            <TableCell>
              {formatPending(transaction.pending)}
            </TableCell>
            <TableCell>{formatAmount(transaction.amount)}</TableCell>
            {/* <TableCell>
              {transaction?.pf_categories?.detailed}
            </TableCell> */}
            {/* <TableCell>
              {new Date(
                transaction.timestamp * 1000
              ).toLocaleString()}
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { TransactionTable };

// op 1 - #6B568E
// op 2 - #55668C
