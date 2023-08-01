import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setSelectedBankKey,
  setSelectedTab,
} from '../../store/bank/bankSlice';
import { BalanceTableRow } from './BalanceTableRow';

const BalanceTable = ({ balances }) => {
  const dispatch = useDispatch();

  const handleBalanceRowClick = (balance) => {
    dispatch(setSelectedBankKey(balance.bank_key));
    dispatch(setSelectedTab('transactions'));
  };

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
          <BalanceTableRow
            balance={balance}
            handleBalanceRowClick={handleBalanceRowClick}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export { BalanceTable };
