import { Button, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  formatCurrency,
  formatDate,
  isShipButtonDisabled,
} from '../../api/helpers/reverbHelpers';
import { dialogType, openDialog } from '../../store/dialog/dialogSlice';
import {
  initialOrderDetail,
  setSelectedOrder,
  updateOrderDetail,
} from '../../store/reverb/reverbSlice';

const ReverbOrderTableRow = ({ order }) => {
  const dispatch = useDispatch();

  const handleShip = (order) => {
    dispatch(setSelectedOrder(order));
    dispatch(updateOrderDetail(initialOrderDetail));
    dispatch(openDialog(dialogType.orderDetail));
  };

  return (
    <TableRow id={`reverb-table-row-id-${order.order_id}`}>
      <TableCell>{order.order_number}</TableCell>
      <TableCell>{order.order_status}</TableCell>
      <TableCell>{order.product}</TableCell>
      <TableCell>{formatDate(order.paid_date)}</TableCell>
      <TableCell>{order.shipment_status}</TableCell>
      <TableCell>{formatDate(order.ship_date)}</TableCell>
      <TableCell>{order.shipping_provider}</TableCell>
      <TableCell>{order.shipping_code}</TableCell>
      <TableCell>{formatCurrency(order.subtotal)}</TableCell>
      <TableCell>{formatDate(order.created_date)}</TableCell>
      <TableCell>
        <Button
          id={`reverb-order-table-row-id-${order.order_id}-ship-button`}
          disabled={isShipButtonDisabled(order)}
          onClick={() => handleShip(order)}>
          Ship
        </Button>
      </TableCell>
    </TableRow>
  );
};

export { ReverbOrderTableRow };
