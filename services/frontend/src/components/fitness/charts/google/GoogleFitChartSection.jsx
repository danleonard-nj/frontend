import { Grid } from '@mui/material';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import * as React from 'react';
import { ServiceTitle } from '../../ServiceTitle';
import GoogleFitCaloriesChart from './GoogleFitCaloriesChart';
import GoogleFitMinutesChart from './GoogleFitMinutesChart';
import GoogleFitStepsChart from './GoogleFitStepsChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const GoogleFitChartSection = () => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={12} xs={12}>
        <ServiceTitle title='Google Fit' />
      </Grid>
      <Grid item lg={4} xs={12} minHeight='25vh'>
        <GoogleFitStepsChart />
      </Grid>
      <Grid item lg={4} xs={12} minHeight='25vh'>
        <GoogleFitMinutesChart />
      </Grid>
      <Grid item lg={4} xs={12} minHeight='25vh'>
        <GoogleFitCaloriesChart />
      </Grid>
    </Grid>
  );
};

export default GoogleFitChartSection;
