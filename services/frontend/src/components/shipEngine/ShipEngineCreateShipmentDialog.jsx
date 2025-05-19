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

/* Subcomponent: Shipper Information */
function ShipperInfo({ createShipment, handleOriginChange }) {
  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography component='h2' variant='h6' color='white'>
        Shipper
      </Typography>
      <Grid container spacing={3}>
        <Grid item lg={6}>
          <TextField
            label='First Name'
            name='first_name'
            value={createShipment?.origin?.first_name ?? ''}
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
            value={createShipment?.origin?.last_name ?? ''}
            onChange={handleOriginChange}
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            label='Street Address'
            name='address_one'
            fullWidth
            variant='standard'
            value={createShipment?.origin?.address_one ?? ''}
            onChange={handleOriginChange}
          />
        </Grid>
        <Grid item lg={6}>
          <TextField
            label='City'
            fullWidth
            variant='standard'
            name='city_locality'
            value={createShipment?.origin?.city_locality ?? ''}
            onChange={handleOriginChange}
          />
        </Grid>
        <Grid item lg={6}>
          <Select
            label='State'
            name='state_province'
            value={createShipment?.origin?.state_province ?? ''}
            onChange={handleOriginChange}
            fullWidth>
            {states.map((state) => (
              <MenuItem key={state.code} value={state.code}>
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
            value={createShipment?.origin?.phone ?? ''}
            onChange={handleOriginChange}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

/* Subcomponent: Destination Information */
function DestinationInfo({
  createShipment,
  handleDestinationChange,
  handleSelectDestinationStateChange,
}) {
  const dispatch = useDispatch();

  const handleCopyAddressFromShipper = () => {
    dispatch(
      updateCreateShipment((shipment) => ({
        ...shipment,
        destination: {
          ...shipment.destination,
          ...shipment.origin, // copy all origin fields to destination
        },
      }))
    );
  };

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography component='h2' variant='h6' color='white'>
        Destination
      </Typography>

      <Grid item lg={12}>
        <Grid container spacing={3}>
          <Grid item lg={6}>
            <TextField
              label='First Name'
              name='first_name'
              fullWidth
              variant='standard'
              value={createShipment?.destination?.first_name ?? ''}
              onChange={handleDestinationChange}
            />
          </Grid>
          <Grid item lg={6}>
            <TextField
              label='Last Name'
              fullWidth
              variant='standard'
              name='last_name'
              value={createShipment?.destination?.last_name ?? ''}
              onChange={handleDestinationChange}
            />
          </Grid>
          <Grid item lg={12}>
            <TextField
              label='Street Address'
              name='address_one'
              fullWidth
              variant='standard'
              value={createShipment?.destination?.address_one ?? ''}
              onChange={handleDestinationChange}
            />
          </Grid>
          <Grid item lg={6}>
            <TextField
              label='City'
              fullWidth
              variant='standard'
              name='city_locality'
              value={createShipment?.destination?.city_locality ?? ''}
              onChange={handleDestinationChange}
            />
          </Grid>
          <Grid item lg={6}>
            <Select
              label='State'
              name='state_province'
              value={
                createShipment?.destination?.state_province ?? ''
              }
              onChange={handleSelectDestinationStateChange}
              fullWidth>
              {states.map((state) => (
                <MenuItem key={state.code} value={state.code}>
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
              value={createShipment?.destination?.zip_code ?? ''}
              onChange={handleDestinationChange}
            />
          </Grid>
          <Grid item lg={6}>
            <TextField
              label='Phone'
              fullWidth
              variant='standard'
              name='phone'
              value={createShipment?.destination?.phone ?? ''}
              onChange={handleDestinationChange}
            />
          </Grid>
          <Grid item lg={12}>
            <Button
              variant='contained'
              onClick={handleCopyAddressFromShipper}>
              Use Shipper Address
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

/* Subcomponent: Package Details */
function PackageDetails({ createShipment, handleChange }) {
  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography component='h2' variant='h6' color='white'>
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
              handleChange(event, parseInt(event.target.value))
            }
            InputProps={{
              type: 'number',
              endAdornment: (
                <InputAdornment position='end'>in</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            label='Width'
            name='width'
            fullWidth
            variant='standard'
            value={createShipment?.width ?? ''}
            onChange={(event) =>
              handleChange(event, tryParseInt(event.target.value))
            }
            InputProps={{
              type: 'number',
              endAdornment: (
                <InputAdornment position='end'>in</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            label='Height'
            name='height'
            fullWidth
            variant='standard'
            value={createShipment?.height ?? ''}
            onChange={(event) =>
              handleChange(event, tryParseInt(event.target.value))
            }
            InputProps={{
              type: 'number',
              endAdornment: (
                <InputAdornment position='end'>in</InputAdornment>
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
              handleChange(event, tryParseInt(event.target.value))
            }
            InputProps={{
              type: 'number',
              endAdornment: (
                <InputAdornment position='end'>lb</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item lg={6}>
          <TextField
            label='Insured Value'
            name='insured_value'
            fullWidth
            variant='standard'
            value={createShipment?.insured_value ?? ''}
            onChange={(event) =>
              handleChange(event, parseInt(event.target.value))
            }
            InputProps={{
              type: 'number',
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

/* Subcomponent: Carrier Selection & Quote */
function CarrierSelection({
  createShipment,
  carrierNameLookup,
  handleGetRate,
}) {
  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item lg={10}>
          <Typography component='h2' variant='h6' color='white'>
            Carrier
          </Typography>
        </Grid>
        <Grid item lg={2} align='right'>
          <Button variant='contained' onClick={handleGetRate}>
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
  );
}

/* Main Component: Create Shipment Dialog */
export default function ShipEngineCreateShipmentDialog() {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.dialog[dialogType.createShipment]
  );
  const createShipment = useSelector(
    (state) => state.shipEngine.createShipment
  );
  const carrierNameLookup = useSelector(
    (state) => state.shipEngine.carrierNameLookup
  );

  const handleClose = () => {
    dispatch(closeDialog(dialogType.createShipment));
  };

  const handleSelectDestinationStateChange = (event) => {
    dispatch(
      updateCreateShipment((shipment) =>
        reduceSelectDestination(shipment, event)
      )
    );
  };

  const handleOriginChange = (event) => {
    dispatch(
      updateCreateShipment((shipment) =>
        reduceOrigin(shipment, event)
      )
    );
  };

  const handleDestinationChange = (event) => {
    dispatch(
      updateCreateShipment((shipment) =>
        reduceDestination(shipment, event)
      )
    );
  };

  const handleChange = (event, value = null) => {
    dispatch(
      updateCreateShipment((shipment) =>
        reduceShipment(shipment, event, value)
      )
    );
  };

  const handleGetRate = () => {
    dispatch(estimateRate());
    dispatch(closeDialog(dialogType.createShipment));
    dispatch(openDialog(dialogType.selectCarrier));
  };

  const handleCreateShipment = () => {
    dispatch(postCreateShipment());
  };

  // Update full names when first or last names change.
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
      {/* Carrier selection dialog */}
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
              <Grid item lg={6}>
                <ShipperInfo
                  createShipment={createShipment}
                  handleOriginChange={handleOriginChange}
                />
              </Grid>
              <Grid item lg={6}>
                <DestinationInfo
                  createShipment={createShipment}
                  handleDestinationChange={handleDestinationChange}
                  handleSelectDestinationStateChange={
                    handleSelectDestinationStateChange
                  }
                />
              </Grid>
              <Grid item lg={6}>
                <PackageDetails
                  createShipment={createShipment}
                  handleChange={handleChange}
                />
              </Grid>
              <Grid item lg={6}>
                <CarrierSelection
                  createShipment={createShipment}
                  carrierNameLookup={carrierNameLookup}
                  handleGetRate={handleGetRate}
                />
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
