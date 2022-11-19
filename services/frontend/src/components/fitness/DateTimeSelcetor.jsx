import { TextField } from '@mui/material';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as React from 'react';

const DateTimeSelector = ({ setDate, date, label, padding }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        renderInput={(props) => <TextField {...props} />}
        label={label}
        value={date ?? ''}
        onChange={(newValue) => {
          setDate(newValue);
        }}
        sx={{ marginLeft: padding, marginRight: padding }}
      />
    </LocalizationProvider>
  );
};

export { DateTimeSelector };
