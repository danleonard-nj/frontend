import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../store/dialog/dialogSlice';
import { createOrderShipment } from '../../store/reverb/reverbActions';
import { updateOrderDetail } from '../../store/reverb/reverbSlice';
import Spinner from '../Spinner';

export default function ReverbOrderDetailDialog() {
  const dispatch = useDispatch();
  const orderDetail = useSelector((x) => x.reverb.orderDetail);
  const createdShipmentLoading = useSelector(
    (x) => x.reverb.createdShipmentLoading
  );
  const isOpen = useSelector((x) => x.dialog[dialogType.orderDetail]);

  const handleClose = () => {
    dispatch(closeDialog(dialogType.orderDetail));
  };

  const handleCreateShipment = () => {
    dispatch(createOrderShipment());
    handleClose();
  };

  const handleChange = (event) => {
    dispatch(
      updateOrderDetail({
        ...orderDetail,
        [event.target.name]: parseInt(event.target.value),
      })
    );
  };

  return (
    <>
      <Dialog
        open={isOpen}
        keepMounted
        fullWidth
        maxWidth='sm'
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'>
        <DialogTitle id='reverb-create-shipment-dialog-title'>
          Create Shipment
        </DialogTitle>
        <DialogContent id='reverb-create-shipment-dialog-content'>
          {createdShipmentLoading ? (
            <Spinner />
          ) : (
            <Grid
              id='reverb-create-shipment-dialog-content-container'
              container
              direction='row'
              padding={1}
              justify='flex-start'
              alignItems='flex-start'
              spacing={1}>
              <Grid container spacing={2}>
                <Grid item lg={12}>
                  <Paper elevation={2} sx={{ padding: 2 }}>
                    <Typography component='h2' variant='h6' color='white'>
                      Dimensions
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item lg={4}>
                        <TextField
                          id='reverb-create-shipment-dialog-length-textfield'
                          label='Length'
                          name='length'
                          value={orderDetail.length}
                          type='number'
                          fullWidth
                          variant='standard'
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item lg={4}>
                        <TextField
                          id='reverb-create-shipment-dialog-width-textfield'
                          label='Width'
                          name='width'
                          value={orderDetail.width}
                          type='number'
                          fullWidth
                          variant='standard'
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item lg={4}>
                        <TextField
                          id='reverb-create-shipment-dialog-height-textfield'
                          label='Height'
                          name='height'
                          value={orderDetail.height}
                          type='number'
                          fullWidth
                          variant='standard'
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item lg={12}>
                  <Paper elevation={2} sx={{ padding: 2 }}>
                    <Typography
                      component='h2'
                      variant='h6'
                      color='white'
                      id='reverb-create-shipment-dialog-weight-title'>
                      Weight
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item lg={4}>
                        <TextField
                          id='reverb-create-shipment-dialog-weight-textfield'
                          label='Weight'
                          name='weight'
                          value={orderDetail.weight}
                          type='number'
                          fullWidth
                          variant='standard'
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            id='reverb-create-shipment-dialog-close-button'>
            Cancel
          </Button>
          <Button
            onClick={handleCreateShipment}
            id='reverb-create-shipment-dialog-create-shipment-button'>
            Create Shipment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
