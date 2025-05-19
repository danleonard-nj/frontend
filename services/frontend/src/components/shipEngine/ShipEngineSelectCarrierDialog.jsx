import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Container,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDialog,
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import Spinner from '../Spinner';
import { ShipEngineCarrierRateCard } from './ShipEngineCarrierRateCard';

const ShipEngineSelectCarrierDialog = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (x) => x.dialog[dialogType.selectCarrier]
  );

  const carrierEstimates =
    useSelector((x) => x.shipEngine.estimate) ?? [];

  const estimateLoading = useSelector(
    (x) => x.shipEngine.estimateLoading
  );

  const handleClose = () => {
    dispatch(closeDialog(dialogType.createShipment));
  };

  const handleGoBack = () => {
    dispatch(openDialog(dialogType.createShipment));
    dispatch(closeDialog(dialogType.selectCarrier));
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
          justifyContent='flex-start'
          alignItems='flex-start'
          spacing={1}>
          {estimateLoading ? (
            <Container>
              <Spinner />
            </Container>
          ) : (
            carrierEstimates.map((carrierEstimate) => (
              <Grid container spacing={2} key={carrierEstimate.id}>
                <Grid item lg={12}>
                  <h1>{carrierEstimate.carrier_friendly_name}</h1>
                </Grid>
                <Grid item lg={12}>
                  <Grid container spacing={3}>
                    {carrierEstimate.estimates.map((estimate) => (
                      <Grid item lg={4}>
                        <ShipEngineCarrierRateCard
                          estimate={estimate}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            ))
          )}
        </Grid>
        <Button onClick={handleGoBack}>Back</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ShipEngineSelectCarrierDialog;
