import {
  Button,
  Grid,
  Typography,
  CardActions,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  closeDialog,
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import { updateCreateShipment } from '../../store/shipEngine/shipEngineActions';

const getTotalShippingCost = (estimate) => {
  const rateDetails = estimate?.rate_details ?? [];

  return rateDetails.reduce(
    (acc, item) => acc + (item?.amount?.amount ?? 0),
    0
  );
};

const RateSummary = ({ estimate }) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={6}>
        Confirm:
      </Grid>
      <Grid item lg={6}>
        ${estimate?.confirmation_amount?.amount ?? 0}
      </Grid>
      <Grid item lg={6}>
        Insurance:
      </Grid>
      <Grid item lg={6}>
        ${estimate?.insurance_amount?.amount ?? 0}
      </Grid>
      <Grid item lg={6}>
        Other:
      </Grid>
      <Grid item lg={6}>
        ${estimate?.other_amount?.amount ?? 0}
      </Grid>
      <Grid item lg={6}>
        Total:
      </Grid>
      <Grid item lg={6}>
        ${getTotalShippingCost(estimate)}
      </Grid>
    </Grid>
  );
};

const RateDetailItem = ({ item }) => {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item lg={6}>
          {item?.carrier_description.toUpperCase()}
        </Grid>
        <Grid item lg={6}>
          ${item?.amount?.amount ?? 0}
        </Grid>
      </Grid>
      <Divider />
    </>
  );
};

const RateDetail = ({ estimate }) => {
  return (
    <Grid container spacing={1}>
      {estimate?.rate_details.map((item) => (
        <>
          <RateDetailItem item={item} />
        </>
      ))}
    </Grid>
  );
};

export const ShipEngineCarrierRateCard = ({ estimate }) => {
  const dispatch = useDispatch();

  const handleSelectCarrier = ({
    carrier_id,
    service_code,
    service_type,
  }) => {
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
    <Card
      sx={{
        minWidth: 275,
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14, marginBottom: 1 }}
          color='text.secondary'
          gutterBottom>
          <Grid container spacing={1}>
            <Grid item lg={9}>
              {new Date(
                estimate.estimated_delivery_date
              ).toLocaleDateString()}
            </Grid>
            <Grid item lg={3} align='right'>
              {estimate?.delivery_days}{' '}
              {estimate?.delivery_days > 1 ? 'days' : 'day'}
            </Grid>
          </Grid>
        </Typography>
        <Typography variant='h5' component='div'>
          {estimate?.service_type ?? 'standard'}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {estimate?.package_type ?? 'package'}
        </Typography>
        <Typography variant='body2'>
          <Grid container spacing={1}>
            <Grid item lg={6}>
              <RateSummary estimate={estimate} />
            </Grid>
            <Grid item lg={6}>
              <RateDetail estimate={estimate} />
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
          onClick={() =>
            handleSelectCarrier({
              carrier_id: estimate.carrier_id,
              service_code: estimate.service_code,
              service_type: estimate.service_type,
            })
          }>
          Select
        </Button>
      </CardActions>
    </Card>
  );
};
