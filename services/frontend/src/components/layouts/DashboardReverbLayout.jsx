import {
  Button,
  Grid,
  Pagination,
  Paper,
  Toolbar,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import { getOrders } from '../../store/reverb/reverbActions';
import Spinner from '../Spinner';
import { ReverbOrderTable } from '../reverb/ReverbOrderTable';

const PaginationContainer = ({ children }) => {
  return (
    <Box
      sx={{
        margin: 'auto',
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        marginTop: 1,
      }}>
      {children}
    </Box>
  );
};

export default function DashboardReverbLayout() {
  const [pageNumber, setPageNumber] = useState(1);

  const { ordersLoading } = useSelector((x) => x.reverb);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders(pageNumber));
  }, []);

  const onPageChange = (event, pageNumber) => {
    setPageNumber(pageNumber);
  };

  const openCreateShipmentDialog = () => {
    dispatch(openDialog(dialogType.orderDetail));
  };

  return (
    <Toolbar>
      <Grid container spacing={3}>
        <Grid item lg={12} align='right'>
          <Button
            variant='contained'
            onClick={openCreateShipmentDialog}>
            Create Shipment
          </Button>
        </Grid>
        <Grid item lg={12} xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Box
              sx={{
                minHeight: '55vh',
              }}>
              {ordersLoading ? <Spinner /> : <ReverbOrderTable />}
            </Box>
            <PaginationContainer>
              <Pagination
                count='0'
                page={pageNumber}
                color='primary'
                onChange={onPageChange}
              />
            </PaginationContainer>
          </Paper>
        </Grid>
      </Grid>
    </Toolbar>
  );
}
