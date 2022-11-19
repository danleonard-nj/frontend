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
import MyFitnessPalChart from './MyFitnessPalChart';

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

const MyFitnessPalChartSection = () => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={12} xs={12}>
        <ServiceTitle title='MyFitnessPal' />
      </Grid>
      <Grid item lg={4} xs={12} minHeight='25vh'>
        <MyFitnessPalChart />
      </Grid>
    </Grid>
  );
};

export default MyFitnessPalChartSection;
