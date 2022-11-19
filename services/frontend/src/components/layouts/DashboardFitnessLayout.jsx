import { Grid, Paper } from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  getConfig,
  getFitnessCalorieDeltas,
} from '../../store/fitness/fitnessActions';
import ChartSection from '../fitness/charts/ChartSection';
import DeltaChartSection from '../fitness/DeltaChartSection';
import FitnessAppBar from '../fitness/FitnessToolbar';

export const DashboardFitnessLayout = () => {
  console.log('fitness layout render');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFitnessCalorieDeltas());
    dispatch(getConfig());
  }, []);

  return (
    <Paper elevation={1} sx={{ margin: 1, padding: 0.25 }}>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <FitnessAppBar />
        </Grid>
        <Grid item lg={12}>
          <Paper elevation={2} sx={{ p: 2, margin: 1, bgcolor: 'black' }}>
            <DeltaChartSection />
          </Paper>
        </Grid>
        <Grid item lg={12} xs={12}>
          <Paper elevation={4} sx={{ margin: 2, padding: 2, bgcolor: 'black' }}>
            <ChartSection />
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};
