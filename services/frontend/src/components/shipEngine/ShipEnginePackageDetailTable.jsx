import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';

export const ShipEnginePackageDetailTable = ({ packageDetail }) => {
  return (
    <Table size='small'>
      <TableBody>
        <TableRow>
          <TableCell />
          <TableCell />
        </TableRow>
        <TableRow>
          <TableCell>Length</TableCell>
          <TableCell>{packageDetail?.length} in</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Width</TableCell>
          <TableCell>{packageDetail?.width} in</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Height</TableCell>
          <TableCell>{packageDetail?.height} in</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Weight</TableCell>
          <TableCell>{packageDetail?.weight} lbs</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Insured Value</TableCell>
          <TableCell>${packageDetail?.insured_value}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
