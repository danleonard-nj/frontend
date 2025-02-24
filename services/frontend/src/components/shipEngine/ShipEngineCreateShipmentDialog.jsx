import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCarrierName,
  reduceDestination,
  reduceOrigin,
  reduceSelectDestination,
  reduceSelectOrigin,
  reduceShipment,
  states,
  tryParseInt,
} from '../../api/helpers/shipEngineHelpers';
import {
  closeDialog,
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import {
  estimateRate,
  postCreateShipment,
  updateCreateShipment,
} from '../../store/shipEngine/shipEngineActions';
import ShipEngineSelectCarrierDialog from './ShipEngineSelectCarrierDialog';

/**
 * ShipEngineCreateShipmentDialog Component
 *
 * Renders a dialog that allows users to create a shipment. This includes sections for:
 * - Shipper (origin) information
 * - Destination information
 * - Package details
 * - Carrier selection & quote
 *
 * It uses Redux to manage the shipment state and dispatches actions for updating
 * shipment details, estimating rates, and creating shipments.
 */
export default function ShipEngineCreateShipmentDialog() {
  const dispatch = useDispatch();

  // Retrieve dialog open state, shipment details, and carrier lookup from Redux store.
  const isOpen = useSelector(
    (state) => state.dialog[dialogType.createShipment]
  );
  const createShipment = useSelector(
    (state) => state.shipEngine.createShipment
  );
  const carrierNameLookup = useSelector(
    (state) => state.shipEngine.carrierNameLookup
  );

  // Close the create shipment dialog
  const handleClose = () => {
    dispatch(closeDialog(dialogType.createShipment));
  };

  // Handler for when the destination state selection changes.
  const handleSelectDestinationStateChange = (event) => {
    dispatch(
      updateCreateShipment((shipment) =>
        reduceSelectDestination(shipment, event)
      )
    );
  };

  // Handler for updating shipper (origin) fields.
  const handleOriginChange = (event) => {
    dispatch(
      updateCreateShipment((shipment) =>
        reduceOrigin(shipment, event)
      )
    );
  };

  // Handler for updating destination fields.
  const handleDestinationChange = (event) => {
    dispatch(
      updateCreateShipment((shipment) =>
        reduceDestination(shipment, event)
      )
    );
  };

  // Generic handler for updating shipment details (e.g., package dimensions).
  // Optionally parses the value (e.g., converting string to integer).
  const handleChange = (event, value = null) => {
    dispatch(
      updateCreateShipment((shipment) =>
        reduceShipment(shipment, event, value)
      )
    );
  };

  // Handler to estimate rates.
  // 1. Dispatches the rate estimation action.
  // 2. Closes the current dialog.
  // 3. Opens the carrier selection dialog.
  const handleGetRate = () => {
    console.log('estimate rates');
    dispatch(estimateRate());
    dispatch(closeDialog(dialogType.createShipment));
    dispatch(openDialog(dialogType.selectCarrier));
  };

  // Handler to create the shipment.
  const handleCreateShipment = () => {
    dispatch(postCreateShipment());
  };

  // Update full names for origin and destination when first or last names change.
  useEffect(() => {
    dispatch(
      updateCreateShipment((shipment) => ({
        ...shipment,
        origin: {
          ...shipment.origin,
          name: `${shipment.origin.first_name} ${shipment.origin.last_name}`,
        },
        destination: {
          ...shipment.destination,
          name: `${shipment.destination.first_name} ${shipment.destination.last_name}`,
        },
      }))
    );
  }, [
    createShipment.origin.first_name,
    createShipment.origin.last_name,
    createShipment.destination.first_name,
    createShipment.destination.last_name,
  ]);

  return (
    <>
      {/* Dialog for selecting carrier (shown conditionally by Redux state) */}
      <ShipEngineSelectCarrierDialog />

      {/* Main Create Shipment Dialog */}
      <Dialog
        open={isOpen}
        keepMounted
        fullWidth
        maxWidth='lg'
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'>
        <DialogTitle>Create Shipment</DialogTitle>
        <DialogContent>
          <Grid
            container
            direction='row'
            padding={1}
            justify='flex-start'
            alignItems='flex-start'
            spacing={1}>
            <Grid container spacing={2}>
              {/* Shipper (Origin) Information */}
              <Grid item lg={6}>
                <Paper elevation={2} sx={{ padding: 2 }}>
                  <Typography
                    component='h2'
                    variant='h6'
                    color='white'>
                    Shipper
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item lg={6}>
                      <TextField
                        label='First Name'
                        name='first_name'
                        value={
                          createShipment?.origin?.first_name ?? ''
                        }
                        fullWidth
                        variant='standard'
                        onChange={handleOriginChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='Last Name'
                        name='last_name'
                        fullWidth
                        variant='standard'
                        value={
                          createShipment?.origin?.last_name ?? ''
                        }
                        onChange={handleOriginChange}
                      />
                    </Grid>
                    <Grid item lg={12}>
                      <TextField
                        label='Street Address'
                        name='address_one'
                        fullWidth
                        value={
                          createShipment?.origin?.address_one ?? ''
                        }
                        variant='standard'
                        onChange={handleOriginChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='City'
                        fullWidth
                        variant='standard'
                        name='city_locality'
                        value={
                          createShipment?.origin?.city_locality ?? ''
                        }
                        onChange={handleOriginChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <Select
                        label='State'
                        name='state_province'
                        value={
                          createShipment?.origin?.state_province ?? ''
                        }
                        onChange={handleOriginChange}
                        fullWidth>
                        {states.map((state) => (
                          <MenuItem
                            key={state.code}
                            value={state.code}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='Zip Code'
                        fullWidth
                        variant='standard'
                        name='zip_code'
                        value={createShipment?.origin?.zip_code ?? ''}
                        onChange={handleOriginChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='Phone'
                        fullWidth
                        variant='standard'
                        name='phone'
                        onChange={handleOriginChange}
                        value={createShipment?.origin?.phone ?? ''}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Destination Information */}
              <Grid item lg={6}>
                <Paper elevation={2} sx={{ padding: 2 }}>
                  <Typography
                    component='h2'
                    variant='h6'
                    color='white'>
                    Destination
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item lg={6}>
                      <TextField
                        label='First Name'
                        name='first_name'
                        fullWidth
                        variant='standard'
                        value={
                          createShipment?.destination?.first_name ??
                          ''
                        }
                        onChange={handleDestinationChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='Last Name'
                        fullWidth
                        variant='standard'
                        name='last_name'
                        value={
                          createShipment?.destination?.last_name ?? ''
                        }
                        onChange={handleDestinationChange}
                      />
                    </Grid>
                    <Grid item lg={12}>
                      <TextField
                        label='Street Address'
                        name='address_one'
                        fullWidth
                        variant='standard'
                        onChange={handleDestinationChange}
                        value={
                          createShipment?.destination?.address_one ??
                          ''
                        }
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='City'
                        fullWidth
                        variant='standard'
                        name='city_locality'
                        onChange={handleDestinationChange}
                        value={
                          createShipment?.destination
                            ?.city_locality ?? ''
                        }
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <Select
                        label='State'
                        name='state_province'
                        value={
                          createShipment.destination.state_province
                        }
                        onChange={handleSelectDestinationStateChange}
                        fullWidth>
                        {states.map((state) => (
                          <MenuItem
                            key={state.code}
                            value={state.code}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='Zip Code'
                        fullWidth
                        variant='standard'
                        name='zip_code'
                        onChange={handleDestinationChange}
                        value={
                          createShipment?.destination?.zip_code ?? ''
                        }
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='Phone'
                        fullWidth
                        variant='standard'
                        name='phone'
                        onChange={handleDestinationChange}
                        value={
                          createShipment?.destination?.phone ?? ''
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Package Details Section */}
              <Grid item lg={6}>
                <Paper elevation={2} sx={{ padding: 2 }}>
                  <Typography
                    component='h2'
                    variant='h6'
                    color='white'>
                    Package Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item lg={4}>
                      <TextField
                        label='Length'
                        name='length'
                        fullWidth
                        variant='standard'
                        value={createShipment?.length ?? ''}
                        onChange={(event) =>
                          handleChange(
                            event,
                            parseInt(event.target.value)
                          )
                        }
                        InputProps={{
                          type: 'number',
                          endAdornment: (
                            <InputAdornment position='end'>
                              in
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item lg={4}>
                      <TextField
                        label='Width'
                        fullWidth
                        name='width'
                        value={createShipment?.width ?? ''}
                        onChange={(event) =>
                          handleChange(
                            event,
                            tryParseInt(event.target.value)
                          )
                        }
                        variant='standard'
                        InputProps={{
                          type: 'number',
                          endAdornment: (
                            <InputAdornment position='end'>
                              in
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item lg={4}>
                      <TextField
                        label='Height'
                        name='height'
                        fullWidth
                        value={createShipment?.height ?? ''}
                        onChange={(event) =>
                          handleChange(
                            event,
                            tryParseInt(event.target.value)
                          )
                        }
                        variant='standard'
                        InputProps={{
                          type: 'number',
                          endAdornment: (
                            <InputAdornment position='end'>
                              in
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='Weight'
                        name='weight'
                        fullWidth
                        variant='standard'
                        value={createShipment?.weight ?? ''}
                        onChange={(event) =>
                          handleChange(
                            event,
                            tryParseInt(event.target.value)
                          )
                        }
                        InputProps={{
                          type: 'number',
                          endAdornment: (
                            <InputAdornment position='end'>
                              lb
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label='Insured Value'
                        fullWidth
                        variant='standard'
                        name='insured_value'
                        value={createShipment?.insured_value ?? ''}
                        onChange={(event) =>
                          handleChange(
                            event,
                            parseInt(event.target.value)
                          )
                        }
                        InputProps={{
                          type: 'number',
                          startAdornment: (
                            <InputAdornment position='start'>
                              $
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Carrier Selection & Quote */}
              <Grid item lg={6}>
                <Paper elevation={2} sx={{ padding: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item lg={10}>
                      <Typography
                        component='h2'
                        variant='h6'
                        color='white'>
                        Carrier
                      </Typography>
                    </Grid>
                    <Grid item lg={2} align='right'>
                      <Button
                        variant='contained'
                        onClick={handleGetRate}>
                        Quote
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item lg={6}>
                      <Grid container spacing={3}>
                        {createShipment?.carrier_id && (
                          <>
                            <Grid item lg={6}>
                              <b>Selected Carrier</b>
                            </Grid>
                            <Grid item lg={6}>
                              <i>
                                {getCarrierName(
                                  carrierNameLookup,
                                  createShipment.carrier_id
                                )}
                              </i>
                            </Grid>
                            <Grid item lg={6}>
                              <b>Selected Service</b>
                            </Grid>
                            <Grid item lg={6}>
                              <i>{createShipment.service_type}</i>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateShipment}>
            Create Shipment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
