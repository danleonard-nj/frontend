import { Grid, TextField } from '@mui/material';
import {
  DatePicker,
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

const DateRangeSelector = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={12} xs={12} sm={12} align='right'>
        <DateTimeSelector
          label='Start Date'
          date={startDate}
          setDate={setStartDate}
        />
        <span style={{ margin: '0 1rem' }}>
          <DateTimeSelector
            label='End Date'
            date={endDate}
            setDate={setEndDate}
          />
        </span>
      </Grid>
    </Grid>
  );
};

export { DateRangeSelector };
