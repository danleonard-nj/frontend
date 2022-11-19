import { Button, Stack } from '@mui/material';

const createButtonColumn = ({ handler, text, color }) => {
  return {
    field: `action-${text}`,
    headerName: '',
    renderCell: (cellValues) => {
      return (
        <Stack direction='row' spacing={1}>
          <Button
            variant='contained'
            color={color}
            size='small'
            onClick={() => handler(cellValues)}>
            {text}
          </Button>
        </Stack>
      );
    },
  };
};

const createButtons = ({ handleEdit, handleDelete, handleView, display }) => {
  return {
    field: 'actionButtons',
    headerName: '',
    flex: 1,
    renderCell: (cellValues) => {
      return (
        <Stack direction='row' spacing={1}>
          {(display?.edit ?? true) && (
            <Button
              variant='contained'
              color='info'
              size='small'
              onClick={() => handleEdit(cellValues)}>
              Edit
            </Button>
          )}
          {(display?.delete ?? true) && (
            <Button
              variant='contained'
              color='error'
              size='small'
              onClick={() => handleDelete(cellValues)}>
              Delete
            </Button>
          )}
          {(display?.view ?? true) && (
            <Button
              variant='contained'
              color='warning'
              size='small'
              onClick={() => handleView(cellValues)}>
              View
            </Button>
          )}
        </Stack>
      );
    },
  };
};

const formatReminderFrequency = (params) => {
  switch (params?.row?.frequency?.frequencyType) {
    case 'Recurring':
      return params.row?.frequency?.cron;
    case 'Once':
      return new Date(params.row?.frequency?.trigger).toLocaleString();
  }
};

const createReminderFields = (timezoneData) => [
  {
    field: 'reminderName',
    headerName: 'Reminder Name',
    flex: 1,
  },
  {
    field: 'reminderType',
    headerName: 'Reminder Type',
    type: 'singleSelect',
    valueOptions: () => ['Generic', 'Destination'],
    flex: 1,
  },
  {
    field: 'frequency',
    headerName: 'Frequency',
    valueGetter: (params) => formatReminderFrequency(params),
    flex: 1,
  },
  {
    field: 'frequencyType',
    headerName: 'Frequency Type',
    type: 'singleSelect',
    valueOptions: () => ['Static', 'Recurring'],
    valueGetter: (params) => params.row?.frequency?.frequencyType,
    flex: 1,
  },
  {
    field: 'timezone',
    headerName: 'Timezone',
    type: 'singleSelect',
    valueOptions: () => timezoneData,
    valueGetter: (params) => params.row?.scheduler?.timezone,
    flex: 1,
  },
  {
    field: 'isActive',
    headerName: 'Active',
    valueGetter: (params) => params.row?.isActive,
    flex: 1,
  },
];

const createNotificationFields = () => {
  return [
    { field: 'notificationName', editable: true, flex: 1 },
    { field: 'notificationType', editable: true, flex: 1 },
    {
      field: 'recipient',
      editable: true,
      type: 'singleSelect',
      valueOptions: () => ['SMS', 'Email'],
      flex: 1,
    },
  ];
};

const createLocationFields = () => {
  return [
    { field: 'locationName', headerName: 'Location', editable: true, flex: 1 },
    { field: 'locationAddress', headerName: 'Address', flex: 1 },
    { field: 'placeId', headerName: 'Google Place ID', flex: 1 },
    { field: 'placeName', headerName: 'Google Place Name', flex: 1 },
    { field: 'latitude', headerName: 'Latitude', flex: 0.3 },
    { field: 'longitude', headerName: 'Longitude', flex: 0.3 },
  ];
};

export const getReminderFields = (timezones, actions) => {
  return [
    ...createReminderFields(timezones),
    createButtonColumn({
      handler: actions.handleEdit,
      color: 'info',
      text: 'Edit',
    }),
    createButtonColumn({
      handler: actions.handleView,
      color: 'warning',
      text: 'View',
    }),
    createButtonColumn({
      handler: actions.handleDelete,
      color: 'error',
      text: 'delete',
    }),
  ];
};

export const getNotificationFields = (actions) => {
  return [...createNotificationFields(), createButtons(actions)];
};

export const getLocationFields = (actions) => {
  return [...createLocationFields(), createButtons(actions)];
};
