import { Grid } from '@mui/material';
import * as React from 'react';
import { ServiceTitle } from '../../ServiceTitle';
import FitIndexBmiChart from './FitIndexBmiChart';
import FitIndexWeightChart from './FitIndexWeightChart';

const FitIndexChartSection = () => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={12} xs={12}>
        <ServiceTitle title='FitIndex' />
      </Grid>
      <Grid item lg={4} xs={12} minHeight='25vh'>
        <FitIndexBmiChart />
      </Grid>
      <Grid item lg={4} xs={12} minHeight='25vh'>
        <FitIndexWeightChart />
      </Grid>
    </Grid>
  );
};

export default FitIndexChartSection;
