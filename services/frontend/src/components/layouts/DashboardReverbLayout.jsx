import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Pagination,
  Paper,
  Toolbar,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dialogType, openDialog } from '../../store/dialog/dialogSlice';
import { getOrders } from '../../store/reverb/reverbActions';
import ReverbOrderTable from '../reverb/ReverbOrderTable';
import Spinner from '../Spinner';

export default function DashboardReverbLayout() {
  const dispatch = useDispatch();
  const ordersLoading = useSelector((x) => x.reverb.ordersLoading);

  const [pageNumber, setPageNumber] = useState(1);

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
        <Grid item lg={10}></Grid>
        <Grid item lg={2}>
          <ButtonGroup variant='text' fullWidth>
            <Button variant='contained' onClick={openCreateShipmentDialog}>
              Create Shipment
            </Button>
          </ButtonGroup>
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
              {!ordersLoading ? (
                <ReverbOrderTable />
              ) : (
                <Container justifyContent='center'>
                  <Spinner />
                </Container>
              )}
            </Box>
            <Box
              sx={{
                margin: 'auto',
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                marginTop: 1,
              }}>
              <Pagination
                count='0'
                page={pageNumber}
                color='primary'
                onChange={onPageChange}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Toolbar>
  );
}
