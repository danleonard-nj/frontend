import { Card, Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useSelector } from 'react-redux';
import { getPackageDetails } from '../../../api/helpers/shipEngineHelpers';
import { ShipEngineAddressDetailTable } from '../ShipEngineAddressDetailTable';
import { ShipEnginePackageDetailTable } from '../ShipEnginePackageDetailTable';
import ShipEngineShipmentLabelDetail from './ShipEngineShipmentLabel';

export default function ShipEngineShipmentExpandedRow({ shipment }) {
  const label = useSelector((x) => x.shipEngine.label);

  return (
    <Box sx={{ margin: 1, minHeight: '40vh', padding: 2 }}>
      <Paper elevation={4} sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          <Grid item lg={5}>
            <Grid container spacing={3}>
              <Grid item lg={12}>
                <Card elevation={3} sx={{ padding: 1 }}>
                  <Typography variant='h5'>Origin</Typography>
                  <ShipEngineAddressDetailTable
                    addressDetail={shipment?.origin}
                  />
                </Card>
              </Grid>

              <Grid item lg={12}>
                <Card elevation={3} sx={{ padding: 1 }}>
                  <Typography variant='h5'>Receipient</Typography>
                  <ShipEngineAddressDetailTable
                    addressDetail={shipment?.destination}
                  />
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card elevation={3} sx={{ padding: 1 }}>
                  <Typography variant='h5'>Package Details</Typography>
                  <ShipEnginePackageDetailTable
                    packageDetail={getPackageDetails(shipment)}
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={7}>
            <ShipEngineShipmentLabelDetail
              label={label}
              shipmentId={shipment.id}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
