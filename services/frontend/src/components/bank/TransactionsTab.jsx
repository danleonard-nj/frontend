import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTransactionParams } from '../../store/bank/bankSlice';
import {
  dateParamsInitialized,
  formatCurrency,
  getDefaultDateRange,
} from '../../api/helpers/bankHelpers';
import { DateRangeSelector } from './DateRangeSelector';
import { getTransactions } from '../../store/bank/bankActions';
import Spinner from '../Spinner';

const getIsoDate = (date) => {
  return date.toISOString().split('T')[0];
};

const getIsoDateFromTimestamp = (timestamp) => {
  return getIsoDate(new Date(timestamp * 1000));
};

const formatPending = (pending) => {
  return pending ? 'True' : 'False';
};

const TransactionTable = ({ transactions }) => {
  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell>Transaction ID</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Categories</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>Key</TableCell>
          <TableCell>Modified</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow
            sx={{
              backgroundColor: transaction.pending ? 'blue' : '',
            }}>
            <TableCell>{transaction.transaction_id}</TableCell>
            <TableCell>
              {getIsoDateFromTimestamp(transaction.transaction_date)}
            </TableCell>
            <TableCell>
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell>
              {(transaction.categories ?? []).join(', ')}
            </TableCell>
            <TableCell>{transaction.name ?? 'N/A'}</TableCell>
            <TableCell>
              {formatPending(transaction.pending)}
            </TableCell>
            <TableCell>
              {transaction?.pf_categories?.detailed}
            </TableCell>
            <TableCell>
              {new Date(
                transaction.timestamp * 1000
              ).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TransactionsTab = () => {
  const {
    selectedBankKey = '',
    transactionsParams = {},
    transactions = [],
    transactionsLoading = true,
  } = useSelector((x) => x.bank);

  const dispatch = useDispatch();

  const handleSetStartDate = (startDate) => {
    dispatch(
      setTransactionParams({ ...transactionsParams, startDate })
    );
  };

  const handleSetEndDate = (endDate) => {
    dispatch(
      setTransactionParams({ ...transactionsParams, endDate })
    );
  };

  useEffect(() => {
    // If the date params are not initialized set the
    // params to the calculated default date range
    if (!dateParamsInitialized(transactionsParams)) {
      const { startDate, endDate } = getDefaultDateRange(7);
      dispatch(
        setTransactionParams({
          ...transactionsParams,
          startDate,
          endDate,
        })
      );
    }
    dispatch(getTransactions());
  }, [selectedBankKey]);

  useEffect(() => {
    dispatch(getTransactions());
  }, [transactionsParams]);

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} xs={12} sm={12}>
        <DateRangeSelector
          startDate={transactionsParams?.startDate ?? ''}
          setStartDate={(val) => handleSetStartDate(val)}
          endDate={transactionsParams?.endDate ?? ''}
          setEndDate={handleSetEndDate}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Divider />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        {transactionsLoading ? (
          <Spinner />
        ) : (
          <TransactionTable transactions={transactions} />
        )}
      </Grid>
    </Grid>
  );
};

export { TransactionsTab };
