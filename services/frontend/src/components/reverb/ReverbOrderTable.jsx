import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dialogType, openDialog } from '../../store/dialog/dialogSlice';
import {
  initialOrderDetail,
  setSelectedOrder,
  updateOrderDetail,
} from '../../store/reverb/reverbSlice';
import { ReverbOrderTableRow } from './ReverbOrderTableRow';

export default function ReverbOrderTable() {
  const dispatch = useDispatch();
  const orders = useSelector((x) => x.reverb.orders);

  return (
    <TableContainer component={Paper} id='reverb-order-table-container'>
      <Table sx={{ border: 'none' }} size='small' id='reverb-order-table'>
        <TableHead id='reverb-order-table-head'>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Paid Date</TableCell>
            <TableCell>Shipment Status</TableCell>
            <TableCell>Ship Date</TableCell>
            <TableCell>Shipment Carrier</TableCell>
            <TableCell>Shipment Tracking</TableCell>
            <TableCell>Subtotal</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody id='reverb-order-table-body'>
          {orders?.length &&
            orders.map((order) => <ReverbOrderTableRow order={order} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
