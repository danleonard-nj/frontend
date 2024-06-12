import { Button } from '@mui/material';

const historyColumns = [
  {
    field: 'timestamp',
    headerName: 'Date',
    width: 200,
  },
  {
    field: 'degrees_fahrenheit',
    headerName: 'Degrees Fahrenheit',
    width: 200,
    valueGetter: (params) => `${params.value} F`,
  },
  {
    field: 'humidity_percent',
    headerName: 'Humidity Percent',
    width: 200,
  },
];

const integrationColumns = [
  {
    field: 'timestamp',
    headerName: 'Date',
    width: 200,
  },
  {
    field: 'device_name',
    headerName: 'Device Name',
    width: 200,
  },
  {
    field: 'event_type',
    headerName: 'Event Type',
    width: 200,
  },
  {
    field: 'result',
    headerName: 'Result',
    width: 200,
  },
];

export { historyColumns, integrationColumns };
