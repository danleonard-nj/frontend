import {
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalances } from '../../store/bank/bankActions';
import Spinner from '../Spinner';
import { formatCurrency } from '../../api/helpers/bankHelpers';

const getGmailLink = (messageBk) => {
  return `https://mail.google.com/mail/u/0/#inbox/${messageBk}`;
};

const DashboardBankingLayout = () => {
  const {
    balances: { balances },
    balancesLoading,
  } = useSelector((x) => x.bank);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBalances());
  }, []);

  const BalanceTable = () => {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bank</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Sync Type</TableCell>
            <TableCell>Sync Date</TableCell>
            <TableCell>Message BK</TableCell>
            <TableCell>GPT</TableCell>
            <TableCell>Tokens Used</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balances.map((balance) => (
            <TableRow key={balance.balance_id}>
              <TableCell>{balance.bank_key}</TableCell>
              <TableCell>
                {formatCurrency(balance.balance ?? 0)}
              </TableCell>
              <TableCell>{balance.sync_type}</TableCell>
              <TableCell>
                {balance.timestamp &&
                  new Date(balance.timestamp * 1000).toLocaleString()}
              </TableCell>
              <TableCell>
                {balance?.sync_type === 'email' ? (
                  <Link href={getGmailLink(balance.message_bk)}>
                    {balance.message_bk}
                  </Link>
                ) : (
                  <Typography variant='body2'>N/A</Typography>
                )}
              </TableCell>
              <TableCell>
                {balance.gpt_tokens > 0 ? 'true' : 'false'}
              </TableCell>
              <TableCell>{balance?.gpt_tokens ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2}>
        <Grid item lg={12} xs={12} sm={12}>
          {balancesLoading ? <Spinner /> : <BalanceTable />}
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardBankingLayout };
