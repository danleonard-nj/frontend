import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalanceHistory } from '../../store/bank/bankActions';
import {
  setBalanceHistoryParams,
  setSelectedBalance,
} from '../../store/bank/bankSlice';
import {
  openDialog,
  dialogType,
} from '../../store/dialog/dialogSlice';
import Spinner from '../Spinner';
import { useLongPress } from './hooks/useLongPress';
import {
  formatCurrency,
  getGmailLink,
} from '../../api/helpers/bankHelpers';

const BalanceHistoryTab = () => {
  const {
    balanceHistory = [],
    balanceHistoryLoading = true,
    selectedBankKey = '',
  } = useSelector((x) => x.bank);

  const dispatch = useDispatch();
  const [daysBack, setDaysBack] = useState(7);

  useEffect(() => {
    if (selectedBankKey) {
      // Calculate dates based on daysBack
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      dispatch(setBalanceHistoryParams({ startDate, endDate }));
      dispatch(getBalanceHistory());
    }
  }, [selectedBankKey, daysBack, dispatch]);

  const handleDaysBackChange = (event) => {
    setDaysBack(event.target.value);
  };

  const handleGmailLinkClick = (e, messageBk) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(getGmailLink(messageBk), '_blank');
  };

  const handleDeleteBalance = useCallback(
    (balance) => {
      dispatch(setSelectedBalance(balance));
      dispatch(openDialog(dialogType.deleteBalance));
    },
    [dispatch]
  );

  if (balanceHistoryLoading) {
    return <Spinner />;
  }

  if (!balanceHistory || balanceHistory.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant='body1' color='text.secondary'>
          No balance history found for {selectedBankKey}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography variant='h6'>
          Balance History for {selectedBankKey}
        </Typography>
        <FormControl size='small' sx={{ minWidth: 150 }}>
          <InputLabel id='days-back-label'>Days Back</InputLabel>
          <Select
            labelId='days-back-label'
            id='days-back-select'
            value={daysBack}
            label='Days Back'
            onChange={handleDaysBackChange}>
            <MenuItem value={7}>7 days</MenuItem>
            <MenuItem value={30}>30 days</MenuItem>
            <MenuItem value={60}>60 days</MenuItem>
            <MenuItem value={90}>90 days</MenuItem>
            <MenuItem value={180}>180 days</MenuItem>
            <MenuItem value={365}>1 year</MenuItem>
            <MenuItem value={730}>2 years</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sync Date</TableCell>
            <TableCell>Bank</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Sync Type</TableCell>
            <TableCell>Message BK</TableCell>
            <TableCell>GPT</TableCell>
            <TableCell>Tokens Used</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balanceHistory.map((balance) => {
            const BalanceRowLongPress = () => {
              const longPressEvent = useLongPress(
                () => handleDeleteBalance(balance),
                { delay: 500 }
              );

              return (
                <TableRow
                  key={balance.balance_id}
                  hover
                  {...longPressEvent}
                  sx={{ cursor: 'pointer', userSelect: 'none' }}>
                  <TableCell>
                    {balance.timestamp &&
                      new Date(
                        balance.timestamp * 1000
                      ).toLocaleString()}
                  </TableCell>
                  <TableCell>{balance.bank_key}</TableCell>
                  <TableCell>
                    {formatCurrency(balance.balance ?? 0)}
                  </TableCell>
                  <TableCell>{balance.sync_type}</TableCell>
                  <TableCell>
                    {balance?.sync_type === 'email' ? (
                      <Link
                        onClick={(e) =>
                          handleGmailLinkClick(e, balance.message_bk)
                        }
                        sx={{ cursor: 'pointer' }}>
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
              );
            };

            return <BalanceRowLongPress key={balance.balance_id} />;
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export { BalanceHistoryTab };
