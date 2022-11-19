import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';

export const ShipEngineAddressDetailTable = ({ addressDetail }) => {
  return (
    <Table size='small'>
      <TableBody>
        <TableRow>
          <TableCell />
          <TableCell />
        </TableRow>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>{addressDetail?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Address</TableCell>
          <TableCell>{addressDetail?.address_one}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>City</TableCell>
          <TableCell>{addressDetail?.city_locality}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>State</TableCell>
          <TableCell>{addressDetail?.state_province}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Country</TableCell>
          <TableCell>{addressDetail?.country_code}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Zip Code</TableCell>
          <TableCell>{addressDetail?.zip_code}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
