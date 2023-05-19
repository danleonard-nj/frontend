import {
  Button,
  Container,
  FormControlLabel,
  Grid,
  Pagination,
  Paper,
  Stack,
  Switch,
  Toolbar,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dialogType, openDialog } from '../../store/dialog/dialogSlice';
import {
  getBalances,
  getLookups,
  getShipments,
  updateShipEnginePagination,
} from '../../store/shipEngine/shipEngineActions';
import { setShowCanceledShipments } from '../../store/shipEngine/shipEngineSlice';
import ShipEngineCreateShipmentDialog from '../shipEngine/ShipEngineCreateShipmentDialog';
import ShipEngineShipmentTable from '../shipEngine/shipmentTable/ShipEngineShipmentTable';
import Spinner from '../Spinner';

export default function DashboardShipEngineLayout() {
  const dispatch = useDispatch();
  const pagination = useSelector((x) => x.shipEngine.pagination);
  const shipmentsLoading = useSelector((x) => x.shipEngine.shipmentsLoading);
  const showCanceledShipments = useSelector(
    (x) => x.shipEngine.showCanceledShipments
  );

  const onPageChange = (event, pageNumber) => {
    dispatch(
      updateShipEnginePagination((pagn) => ({
        ...pagn,
        pageNumber: pageNumber,
      }))
    );
  };

  const openCreateShipmentDialog = () => {
    dispatch(openDialog(dialogType.createShipment));
  };

  const handleShowCanceledShipments = () => {
    console.log('showing canceled shipments');
    dispatch(setShowCanceledShipments(!showCanceledShipments));
    dispatch(getShipments());
  };

  useEffect(() => {
    dispatch(getLookups());
    dispatch(getShipments());
    dispatch(getBalances());
  }, []);

  useEffect(() => {
    dispatch(getShipments());
  }, [pagination.pageNumber]);

  return (
    <Toolbar>
      <Grid container spacing={3} id='ship-engine-layout-container'>
        <Grid item id='ship-engine-create-shipment-button-container'>
          <Stack direction='row' spacing={2}>
            <Button
              variant='contained'
              id='ship-engine-create-shipment-button'
              onClick={openCreateShipmentDialog}>
              Create Shipment
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={showCanceledShipments ?? false}
                  onChange={handleShowCanceledShipments}
                />
              }
              label='Canceled Shipments'
            />
          </Stack>
        </Grid>
        <Grid item lg={12} xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}>
            <ShipEngineCreateShipmentDialog />
            <Box
              id='ship-engine-shipment-table-box'
              sx={{
                minHeight: '55vh',
              }}>
              {!shipmentsLoading ? (
                <ShipEngineShipmentTable id='ship-engine-shipment-table' />
              ) : (
                <Container>
                  <Spinner />
                </Container>
              )}
            </Box>
            <Box
              id='ship-engine-pagination-box'
              sx={{
                margin: 'auto',
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                marginTop: 1,
              }}>
              <Pagination
                id='ship-engine-pagination'
                count={pagination?.totalPages ?? 1}
                page={pagination?.pageNumber ?? 1}
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
