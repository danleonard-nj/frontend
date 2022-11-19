import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import {
  getCarrierName,
  getLabelStatus,
  getServiceCodeName,
  getTrackingStatus,
  trackShipment,
} from '../../../../api/helpers/shipEngineHelpers';

const ShipEngineLabelDetailTable = () => {
  const label = useSelector((x) => x.shipEngine.label);
  const serviceCodeLookup = useSelector((x) => x.shipEngine.serviceCodeLookup);
  const carrierNameLookup = useSelector((x) => x.shipEngine.carrierNameLookup);

  return label?.isError ? (
    <Typography variant='body1'>{label?.details}</Typography>
  ) : (
    <Table size='small'>
      <TableBody>
        <TableRow>
          <TableCell>Label ID</TableCell>
          <TableCell>{label?.details?.label_id}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Created Date</TableCell>
          <TableCell>
            {label?.details?.created_date
              ? new Date(label?.details?.created_date).toLocaleString()
              : ''}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Carrier</TableCell>
          <TableCell>
            {getCarrierName(carrierNameLookup, label?.details?.carrier_id)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Service</TableCell>
          <TableCell>
            {getServiceCodeName(
              serviceCodeLookup,
              label?.details?.service_code
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Shipment Cost</TableCell>
          <TableCell>${label?.details?.shipment_cost}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Insurance Cost</TableCell>
          <TableCell>${label?.details?.insurance_cost}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Label Status</TableCell>
          <TableCell>{getLabelStatus(label?.details?.status)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tracking Status</TableCell>
          <TableCell>
            {getTrackingStatus(label?.details?.tracking_status)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tracking Number</TableCell>
          <TableCell>
            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() => trackShipment(label?.details?.tracking_number)}>
              {label?.details?.tracking_number}
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>PDF</TableCell>
          <TableCell>
            <Link
              href={label?.details?.download_pdf}
              target='_blank'
              rel='noopener noreferrer'>
              Download
            </Link>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ShipEngineLabelDetailTable;
