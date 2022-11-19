import { Grid, Paper } from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFitnessRange } from '../../../store/fitness/fitnessActions';
import MyFitnessPalChartSection from './mfp/MyFitnessPalChartSection';
import FitIndexChartSection from './fitindex/FitIndexChartSection';
import GoogleFitChartSection from './google/GoogleFitChartSection';

const ChartSection = () => {
  const dispatch = useDispatch();
  const fitnessDataRangeLoading = useSelector(
    (x) => x.fitness.fitnessDataRangeLoading
  );

  useEffect(() => {
    dispatch(getFitnessRange());
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={12} xs={12}>
          <Paper elevation={4} sx={{ margin: 2, padding: 2, bgcolor: 'black' }}>
            {!fitnessDataRangeLoading && <MyFitnessPalChartSection />}
          </Paper>
        </Grid>
        <Grid item lg={12} xs={12}>
          <Paper elevation={4} sx={{ margin: 2, padding: 2, bgcolor: 'black' }}>
            {!fitnessDataRangeLoading && <GoogleFitChartSection />}
          </Paper>
        </Grid>
        <Grid item lg={12} xs={12}>
          <Paper elevation={4} sx={{ margin: 2, padding: 2, bgcolor: 'black' }}>
            {!fitnessDataRangeLoading && <FitIndexChartSection />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ChartSection;
