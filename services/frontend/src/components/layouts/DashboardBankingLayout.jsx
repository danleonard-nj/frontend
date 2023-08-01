import { Grid, Paper, Tab, Tabs } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalances } from '../../store/bank/bankActions';
import { setSelectedTab } from '../../store/bank/bankSlice';
import Spinner from '../Spinner';
import { BalanceTable } from '../bank/BalanceTable';
import { TransactionsTab } from '../bank/TransactionsTab';

const DashboardBankingLayout = () => {
  const {
    balances: { balances },
    balancesLoading = true,
    selectedBankKey = '',
    selectedTab = 'balances',
  } = useSelector((x) => x.bank);

  const dispatch = useDispatch();

  const handleSetSelectedTab = (tab) => {
    dispatch(setSelectedTab(tab));
  };

  useEffect(() => {
    dispatch(getBalances());
  }, []);

  const BalanceTab = () => {
    return balancesLoading ? (
      <Spinner />
    ) : (
      <BalanceTable balances={balances} />
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2}>
        <Grid item lg={12} xs={12} sm={12}>
          <Tabs
            sx={{ marginBottom: '1rem' }}
            value={selectedTab}
            onChange={(event, tab) => handleSetSelectedTab(tab)}>
            <Tab label='Balances' value='balances' />
            <Tab
              label='Transactions'
              value='transactions'
              disabled={!selectedBankKey}
            />
          </Tabs>
          {selectedTab === 'balances' && <BalanceTab />}
          {selectedTab === 'transactions' && <TransactionsTab />}
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardBankingLayout };
