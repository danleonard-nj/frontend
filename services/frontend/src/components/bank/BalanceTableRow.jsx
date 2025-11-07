import { Link, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import {
  formatCurrency,
  getGmailLink,
} from '../../api/helpers/bankHelpers';

const BalanceTableRow = ({
  balance,
  handleBalanceRowClick,
  rowSelected,
}) => {
  const handleGmailLinkClick = (e, messageBk) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(getGmailLink(messageBk), '_blank');
  };

  return (
    <TableRow
      hover
      key={balance.balance_id}
      sx={{ cursor: 'pointer' }}
      selected={rowSelected}
      onClick={() => handleBalanceRowClick(balance)}>
      <TableCell>
        {balance.timestamp &&
          new Date(balance.timestamp * 1000).toLocaleString()}
      </TableCell>
      <TableCell>{balance.bank_key}</TableCell>
      <TableCell>{formatCurrency(balance.balance ?? 0)}</TableCell>
      <TableCell>{balance.sync_type}</TableCell>
      <TableCell>
        {balance?.sync_type === 'email' ? (
          <Link
            onClick={(e) =>
              handleGmailLinkClick(e, balance.message_bk)
            }>
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

export { BalanceTableRow };
