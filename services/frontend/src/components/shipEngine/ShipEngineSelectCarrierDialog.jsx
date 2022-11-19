import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Container,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCarrierName,
  getQuotesByCarrierId,
} from '../../api/helpers/shipEngineHelpers';
import { closeDialog, dialogType } from '../../store/dialog/dialogSlice';
import Spinner from '../Spinner';
import ShipEngineCarrierRateCard from './ShipEngineCarrierRateCard';

const ShipEngineSelectCarrierDialog = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((x) => x.dialog[dialogType.selectCarrier]);
  const rate = useSelector((x) => x.shipEngine.rate) ?? {};
  const rateLoading = useSelector((x) => x.shipEngine.rateLoading);
  const carrierNameLookup =
    useSelector((x) => x.shipEngine.carrierNameLookup) ?? [];

  const handleClose = () => {
    dispatch(closeDialog(dialogType.createShipment));
  };

  return (
    <Dialog
      open={isOpen}
      keepMounted
      fullWidth
      maxWidth='lg'
      onBackdropClick={handleClose}
      onClose={handleClose}
      aria-describedby='alert-dialog-slide-description'
      sx={{ maxHeight: '85vh', minHeight: '85vh' }}>
      <DialogTitle>Carriers</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction='row'
          padding={1}
          justify='flex-start'
          alignItems='flex-start'
          spacing={1}>
          {rateLoading ? (
            <Container>
              <Spinner />
            </Container>
          ) : (
            Object.keys(rate.quotes).map((carrierId) => (
              <>
                <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item lg={12}>
                      <h1>{getCarrierName(carrierNameLookup, carrierId)}</h1>
                      <Grid container spacing={3}>
                        {getQuotesByCarrierId(rate.quotes, carrierId).map(
                          (quote) => (
                            <Grid item lg={4}>
                              <ShipEngineCarrierRateCard
                                quote={quote}
                                key={quote.rate_id}
                              />
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            ))
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ShipEngineSelectCarrierDialog;
