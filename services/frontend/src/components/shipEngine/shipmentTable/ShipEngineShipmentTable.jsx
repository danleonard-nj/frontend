import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
} from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLabel } from '../../../store/shipEngine/shipEngineActions';
import ShipEngineShipmentTableRow from './ShipEngineShipmentTableRow';

export default function ShipEngineShipmentTable() {
  const dispatch = useDispatch();
  const shipments = useSelector((x) => x.shipEngine.shipments);
  const selectedShipment = useSelector((x) => x.shipEngine.selectedShipment);

  useEffect(() => {
    dispatch(getLabel(selectedShipment));
  }, [selectedShipment]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ border: 'none' }} size='small'>
        <TableHead>
          <TableRow>
            <TableCell />

            <TableCell>ID</TableCell>
            <TableCell>Carrier ID</TableCell>
            <TableCell>Service Code</TableCell>
            <TableCell>Recipient</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Ship Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Dimensions</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments?.length &&
            shipments.map((shipment) => (
              <ShipEngineShipmentTableRow
                shipment={shipment}
                key={shipment.id}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
