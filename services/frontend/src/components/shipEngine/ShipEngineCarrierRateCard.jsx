import {
  Button,
  Grid,
  Typography,
  CardActions,
  Card,
  CardContent,
} from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  closeDialog,
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import { updateCreateShipment } from '../../store/shipEngine/shipEngineActions';

export default function ShipEngineCarrierRateCard({ quote }) {
  const dispatch = useDispatch();

  const handleSelectCarrier = ({ carrier_id, service_code, service_type }) => {
    dispatch(
      updateCreateShipment((shipment) => ({
        ...shipment,
        carrier_id: carrier_id,
        service_code: service_code,
        service_type: service_type,
      }))
    );
    dispatch(closeDialog(dialogType.selectCarrier));
    dispatch(openDialog(dialogType.createShipment));
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14, marginBottom: 1 }}
          color='text.secondary'
          gutterBottom>
          <Grid container spacing={1}>
            <Grid item lg={9}>
              {new Date(quote.delivery_date).toLocaleDateString()}
            </Grid>
            <Grid item lg={3} align='right'>
              {quote.transit_time} {quote.transit_time > 1 ? 'days' : 'day'}
            </Grid>
          </Grid>
        </Typography>
        <Typography variant='h5' component='div'>
          {quote.carrier.service_type}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {quote.carrier.package_type}
        </Typography>
        <Typography variant='body2'>
          <Grid container spacing={1}>
            <Grid item lg={6}>
              Confirmation:
            </Grid>
            <Grid item lg={6}>
              ${quote.cost.confirmation_amount}
            </Grid>
            <Grid item lg={6}>
              Insurance:
            </Grid>
            <Grid item lg={6}>
              ${quote.cost.insurance_amount}
            </Grid>
            <Grid item lg={6}>
              Other:
            </Grid>
            <Grid item lg={6}>
              ${quote.cost.other_amount}
            </Grid>
            <Grid item lg={6}>
              Total:
            </Grid>
            <Grid item lg={6}>
              ${quote.cost.total_amount}
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          fullWidth
          align='right'
          variant='contained'
          color='secondary'
          onClick={() => handleSelectCarrier(quote.carrier)}>
          Select
        </Button>
      </CardActions>
    </Card>
  );
}
