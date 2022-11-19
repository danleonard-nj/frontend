import { Grid, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { toDateString } from '../../api/helpers/dateTimeUtils';
import {
  getFitnessCalorieDeltas,
  getFitnessRange,
} from '../../store/fitness/fitnessActions';
import { setFitnessDateRange } from '../../store/fitness/fitnessSlice';
import { DateTimeSelector } from './DateTimeSelcetor';

const FitnessAppBar = () => {
  const dispatch = useDispatch();
  const dateRange = useSelector((x) => x.fitness.fitnessDateRange);

  const handleStartDateChange = (date) => {
    dispatch(
      setFitnessDateRange({ ...dateRange, startDate: toDateString(date) })
    );
  };

  const handleEndDateChange = (date) => {
    dispatch(
      setFitnessDateRange({ ...dateRange, endDate: toDateString(date) })
    );
  };

  const handleSearch = () => {
    dispatch(getFitnessRange());
    dispatch(getFitnessCalorieDeltas());
  };

  return (
    <Paper elevation={1} sx={{ margin: 2, padding: 2, bgcolor: 'black' }}>
      <Grid
        container
        spacing={2}
        direction='row'
        justifyContent='space-between'
        alignItems='center'>
        <Grid item lg={7} xs={12}>
          <Typography variant='h6'>Fitness</Typography>
        </Grid>
        <Grid item lg={2} xs={12}>
          <DateTimeSelector
            date={dateRange?.startDate ?? ''}
            setDate={handleStartDateChange}
            label='Start'
            padding='1'
          />
        </Grid>
        <Grid item lg={2} xs={12}>
          <DateTimeSelector
            fullWidth
            date={dateRange?.endDate ?? ''}
            setDate={handleEndDateChange}
            label='End'
            padding='1'
          />
        </Grid>
        <Grid item lg={1} xs={12}>
          <Button
            fullWidth
            variant='contained'
            onClick={handleSearch}
            sx={{ margin: 1 }}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FitnessAppBar;
