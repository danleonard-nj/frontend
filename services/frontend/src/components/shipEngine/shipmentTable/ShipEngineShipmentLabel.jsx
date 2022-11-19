import { Card, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../Spinner';
import ShipEngineCreateLabelButton from './components/ShipEngineCreateLabelButton';
import ShipEngineLabelDetailTable from './components/ShipEngineLabelDetailTable';

export default function ShipEngineShipmentLabelDetail() {
  const labelLoading = useSelector((x) => x.shipEngine.labelLoading);
  const label = useSelector((x) => x.shipEngine.label);

  const showLabelDetails = () => {
    return label?.details?.label !== null;
  };

  return (
    <Card elevation={3} sx={{ padding: 1 }}>
      <Grid container spacing={3}>
        {labelLoading ? (
          <Grid item lg={12}>
            <Container>
              <Spinner />
            </Container>
          </Grid>
        ) : showLabelDetails() ? (
          <>
            <Grid item lg={8}>
              <Typography variant='h5'>Label</Typography>
            </Grid>
            <Grid item lg={12}>
              <ShipEngineLabelDetailTable />
            </Grid>
          </>
        ) : (
          <ShipEngineCreateLabelButton />
        )}
      </Grid>
    </Card>
  );
}
