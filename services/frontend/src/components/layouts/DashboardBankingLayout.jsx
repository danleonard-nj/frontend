import {
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

  // const NestPageHeader = () => {
  //   return (
  //     <Grid container>
  //       <Grid item lg={10}>
  //         <Typography variant='h5' gutterBottom>
  //           Sensor Info
  //         </Typography>
  //       </Grid>
  //       <Grid item lg={2} align='right'>
  //         <Button
  //           variant='contained'
  //           onClick={handleRefreshSensorInfo}
  //           sx={{ float: 'right' }}>
  //           Refresh
  //         </Button>
  //       </Grid>
  //     </Grid>
  //   );
  // };

  const BalanceTable = () => {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bank</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Sync Date</TableCell>
            <TableCell>Message BK</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balances.map((balance) => (
            <TableRow key={balance.bank_key}>
              <TableCell>{balance.bank_key}</TableCell>
              <TableCell>
                {formatCurrency(balance.balance ?? 0)}
              </TableCell>
              <TableCell>
                {balance.timestamp &&
                  new Date(balance.timestamp * 1000).toLocaleString()}
              </TableCell>
              <TableCell>
                <Link href={getGmailLink(balance.message_bk)}>
                  {balance.message_bk}
                </Link>
              </TableCell>
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
        <Grid item lg={3} xs={12} sm={12}>
          {balancesLoading ? <Spinner /> : <BalanceTable />}
        </Grid>
        <Grid item lg={9}>
          <Grid container spacing={2}>
            {/* <Grid item lg={12}>
              {sideNav === 'sensor-info' && <NestSensorInfoPage />}
              {sideNav === 'thermostat' && <NestThermostatPage />}
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardBankingLayout };
