import { Grid } from '@mui/material';
import React from 'react';
import { DateTimeSelector } from '../fitness/DateTimeSelcetor';

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
