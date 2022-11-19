import { Button, Collapse, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCarrierName,
  getDimensions,
  getServiceCodeName,
  getStatusName,
  getWeight,
} from '../../../api/helpers/shipEngineHelpers';
import { cancelShipment } from '../../../store/shipEngine/shipEngineActions';
import ShipEngineExpandRowButton from './components/ShipEngineExpandRowButton';
import ShipEngineShipmentExpandedRow from './ShipEngineShipmentExpandedRow';

export default function ShipEngineShipmentTableRow({ shipment }) {
  const dispatch = useDispatch();
  const carrierNameLookup = useSelector((x) => x.shipEngine.carrierNameLookup);
  const serviceCodeLookup = useSelector((x) => x.shipEngine.serviceCodeLookup);
  const selectedShipment = useSelector((x) => x.shipEngine.selectedShipment);

  const handleCancelShipment = (shipmentId) => {
    dispatch(cancelShipment(shipmentId));
  };

  return (
    <>
      <TableRow id={`ship-engine-shipment-table-row-id-${shipment.id}`}>
        <TableCell>
          <ShipEngineExpandRowButton shipment={shipment} />
        </TableCell>

        <TableCell>{shipment.id}</TableCell>
        <TableCell>
          {getCarrierName(carrierNameLookup, shipment.carrier_id)}
        </TableCell>
        <TableCell>
          {getServiceCodeName(serviceCodeLookup, shipment.service_code)}
        </TableCell>
        <TableCell>{shipment?.destination?.name}</TableCell>
        <TableCell>{shipment.created_date}</TableCell>
        <TableCell>{shipment.ship_date}</TableCell>
        <TableCell>{getStatusName(shipment.shipment_status)}</TableCell>
        <TableCell>{getDimensions(shipment)}</TableCell>
        <TableCell>{getWeight(shipment)}</TableCell>
        <TableCell>
          <Button
            variant='contained'
            size='small'
            color='error'
            onClick={() => handleCancelShipment(shipment.id)}>
            Cancel
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          sx={{ border: 0, paddingTop: 0, paddingBottom: 0 }}
          colSpan={12}>
          <Collapse
            in={selectedShipment == shipment.id}
            timeout='auto'
            unmountOnExit>
            <ShipEngineShipmentExpandedRow shipment={shipment} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
