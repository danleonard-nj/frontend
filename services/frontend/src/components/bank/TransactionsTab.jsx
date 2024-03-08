import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDefaultDateRange,
  dateParamsInitialized as isTransactionDateRangeInitialized,
} from '../../api/helpers/bankHelpers';
import { getTransactions } from '../../store/bank/bankActions';
import {
  setShowPendingTransactions,
  setTransactionParams,
} from '../../store/bank/bankSlice';
import Spinner from '../Spinner';
import { DateRangeSelector } from './DateRangeSelector';
import { TransactionTable } from './TransactionTable';

const splitAndCapitalize = (str) => {
  const words = str.split('-');
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);
    return firstLetter + restOfWord;
  });
  return capitalizedWords.join(' ');
};

const TransactionsTab = () => {
  const {
    selectedBankKey = '',
    transactionsParams = {},
    transactions = [],
    transactionsLoading = true,
    showPendingTransactions = true,
  } = useSelector((x) => x.bank);

  const [filteredData, setFilteredData] = React.useState([]);

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

  const handleShowPending = (showPending) => {
    console.log('showPending', showPending);
    dispatch(setShowPendingTransactions(showPending));
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

  useEffect(() => {
    const filtered = [];
    for (const transaction of transactions) {
      if (!showPendingTransactions && transaction.pending) {
        continue;
      }
      filtered.push(transaction);
    }

    filtered.sort((a, b) => b.transaction_date - a.transaction_date);
    setFilteredData(filtered);
  }, [showPendingTransactions, transactions]);

  return (
    <Grid container spacing={3} justifyContent='flex-end'>
      <Grid item lg={6}>
        <Typography variant='h5'>
          <b>{splitAndCapitalize(selectedBankKey)}</b>
        </Typography>
      </Grid>
      <Grid item lg={6}>
        <DateRangeSelector
          startDate={transactionsParams?.startDate ?? ''}
          setStartDate={(val) => handleSetStartDate(val)}
          endDate={transactionsParams?.endDate ?? ''}
          setEndDate={handleSetEndDate}
        />
      </Grid>

      <Grid item lg={12}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                value={handleShowPending}
                defaultChecked
                onChange={(e) => handleShowPending(e.target.checked)}
              />
            }
            label='Show Pending'
          />
        </FormGroup>
      </Grid>

      <Grid item lg={12} xs={12} sm={12}>
        <Divider />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        {transactionsLoading ? (
          <Spinner />
        ) : (
          <TransactionTable
            transactions={filteredData}
            transactionsLoading={transactionsLoading}
            showPendingTransactions={showPendingTransactions}
          />
        )}
      </Grid>
    </Grid>
  );
};

export { TransactionsTab };
