import { Divider, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDefaultDateRange,
  dateParamsInitialized as isTransactionDateRangeInitialized,
} from '../../api/helpers/bankHelpers';
import { getTransactions } from '../../store/bank/bankActions';
import { setTransactionParams } from '../../store/bank/bankSlice';
import Spinner from '../Spinner';
import { DateRangeSelector } from './DateRangeSelector';
import { TransactionTable } from './TransactionTable';

const getIsoDate = (date) => {
  return date.toISOString().split('T')[0];
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

  const initializeTransactionDateParameters = () => {
    const { startDate, endDate } = getDefaultDateRange(7);
    dispatch(
      setTransactionParams({
        ...transactionsParams,
        startDate,
        endDate,
      })
    );
  };

  useEffect(() => {
    // Verify the transaction date parameter start and end date
    // are set to a value other than default (empty string)
    const initialized = isTransactionDateRangeInitialized(
      transactionsParams
    );

    if (!initialized) {
      initializeTransactionDateParameters();
    }

    dispatch(getTransactions());
  }, [selectedBankKey]);

  useEffect(() => {
    dispatch(getTransactions());
  }, [transactionsParams]);

  return (
    <Grid container spacing={3}>
      <Grid item lg={6}>
        <Typography variant='h6'>Bank: {selectedBankKey}</Typography>
      </Grid>
      <Grid item lg={6} align='right'>
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
