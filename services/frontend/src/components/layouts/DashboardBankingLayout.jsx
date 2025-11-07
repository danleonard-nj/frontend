import {
  Grid,
  Paper,
  Tab,
  Tabs,
  Button,
  Tooltip,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalances } from '../../store/bank/bankActions';
import { setSelectedTab } from '../../store/bank/bankSlice';
import Spinner from '../Spinner';
import { BalanceHistoryTab } from '../bank/BalanceHistoryTab';
import { BalanceTable } from '../bank/BalanceTable';

const DashboardBankingLayout = () => {
  const {
    balances = [],
    balancesLoading = true,
    selectedBankKey = '',
    selectedTab = 'balances',
  } = useSelector((x) => x.bank);

  const dispatch = useDispatch();

  const handleSetSelectedTab = (tab) => {
    dispatch(setSelectedTab(tab));
  };

  // useEffect(() => {
  //   dispatch(getBalances());
  // }, []);

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Tabs
              sx={{ marginBottom: '1rem' }}
              value={selectedTab}
              onChange={(event, tab) => handleSetSelectedTab(tab)}>
              <Tab label='Balances' value='balances' />
              <Tab
                label='Balance History'
                value='history'
                disabled={!selectedBankKey}
              />
            </Tabs>
            <Tooltip title='Open Plaid Sync Console' placement='left'>
              <Button
                variant='outlined'
                color='primary'
                component='a'
                href='https://plaid-sync-console.dan-leonard.com'
                target='_blank'
                rel='noopener noreferrer'
                startIcon={<OpenInNewIcon />}
                sx={{ marginLeft: 2, fontWeight: 500 }}>
                Console
              </Button>
            </Tooltip>
          </div>
          {selectedTab === 'balances' && <BalanceTab />}
          {selectedTab === 'history' && <BalanceHistoryTab />}
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardBankingLayout };
