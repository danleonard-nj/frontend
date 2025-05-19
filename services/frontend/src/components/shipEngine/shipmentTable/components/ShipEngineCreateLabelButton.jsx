import { Button, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createLabel,
  voidLabel,
} from '../../../../store/shipEngine/shipEngineActions';

const ShipEngineCreateLabelButton = () => {
  const dispatch = useDispatch();
  const selectedShipment = useSelector(
    (x) => x.shipEngine.selectedShipment
  );

  const handleCreateLabel = () => {
    dispatch(createLabel(selectedShipment));
  };

  return (
    <>
      <Grid item lg={6}>
        <Typography variant='h5'>Label</Typography>
      </Grid>
      <Grid item lg={6} align='right'>
        <Button
          variant='contained'
          size='small'
          onClick={() => handleCreateLabel()}>
          Create Label
        </Button>
      </Grid>
    </>
  );
};

const ShipEngineVoidLabelButton = () => {
  const label = useSelector((x) => x.shipEngine.label);
  const dispatch = useDispatch();

  const handleVoidLabel = () => {
    // Dispatch the action to void the label
    dispatch(voidLabel(label.id));
  };

  return (
    <Button
      color='error'
      variant='contained'
      size='small'
      onClick={handleVoidLabel}>
      Void Label
    </Button>
  );
};

export { ShipEngineCreateLabelButton, ShipEngineVoidLabelButton };
