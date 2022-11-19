import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedShipment } from '../../../../store/shipEngine/shipEngineSlice';

const ShipEngineExpandRowButton = ({ shipment }) => {
  const dispatch = useDispatch();
  const selectedShipment = useSelector((x) => x.shipEngine.selectedShipment);

  const handleExpandRow = (shipmentId) => {
    dispatch(
      setSelectedShipment(selectedShipment === shipmentId ? null : shipmentId)
    );
  };

  return (
    <IconButton
      aria-label='expand row'
      sx={{ margin: 'auto' }}
      onClick={() => handleExpandRow(shipment.id)}>
      {selectedShipment == shipment.id ? (
        <KeyboardArrowUpIcon />
      ) : (
        <KeyboardArrowDownIcon />
      )}
    </IconButton>
  );
};

export default ShipEngineExpandRowButton;
