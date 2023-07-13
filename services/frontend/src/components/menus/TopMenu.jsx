import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { setSideMenu } from '../../store/dashboard/dashboardSlice';
import { useMsal } from '@azure/msal-react';
import {
  getBalance,
  getBalances,
} from '../../store/bank/bankActions';
import { useEffect } from 'react';
import { formatCurrency } from '../../api/helpers/bankHelpers';
import { Card, CardContent, Divider, Tooltip } from '@mui/material';
import { GenericJsonEditor } from '../GenericJsonEditor';
import {
  toDateString,
  toLocalDateTime,
} from '../../api/helpers/dateTimeUtils';

const capitalize = (value) => {
  return value
    .split('')
    .map((char, index) => (index == 0 ? char.toUpperCase() : char))
    .join('');
};

const TopMenu = () => {
  const { page: title } = useSelector((x) => x.dashboard);
  const { balance, balanceLoading, balances, balancesLoading } =
    useSelector((x) => x.bank);

  const { instance } = useMsal();
  const dispatch = useDispatch();

  function openSidebar() {
    dispatch(setSideMenu(true));
  }

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  };

  useEffect(() => {
    dispatch(getBalances());
    dispatch(getBalance('wells-fargo'));
  }, []);

  const formatTimestamp = (timestamp) =>
    new Date((timestamp ?? 0) * 1000).toLocaleString();

  const BankInfoDivider = () => {
    return <Divider sx={{ marginTop: 1, marginBottom: 1 }} />;
  };

  const BalancesCard = () => {
    console.log(JSON.stringify(balances));
    return (
      <Card>
        <CardContent>
          {balancesLoading ? (
            'Loading...'
          ) : (
            <div style={{ display: 'flex' }}>
              {balances.map((balance) => (
                <Typography variant='body2' gutterBottom>
                  <b>Timestamp:</b>{' '}
                  {formatTimestamp(balance.timestamp)}
                  <BankInfoDivider />
                  <b>Bank Key:</b> {balance.bank_key}
                  <BankInfoDivider />
                  <b>Balance:</b> {formatCurrency(balance.balance)}:
                </Typography>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }} id='top-menu-flex'>
      <AppBar position='static' id='top-menu-bar'>
        <Toolbar id='top-menu-toolbar'>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={openSidebar}
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}>
            {capitalize(title)}
          </Typography>
          <Tooltip
            placement='bottom-end'
            title={
              <>
                <BalancesCard />
              </>
            }>
            <Typography
              variant='body2'
              component='div'
              sx={{ float: 'right', marginRight: '1rem' }}>
              WF:{' '}
              {balanceLoading
                ? 'Loading...'
                : formatCurrency(balance.balance)}
            </Typography>
          </Tooltip>
          <Button color='inherit' onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export { TopMenu };
