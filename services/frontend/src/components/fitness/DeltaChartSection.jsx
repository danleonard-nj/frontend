import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import DeltaChart from './charts/DeltaChart';

const DeltaChartSection = () => {
  const calorieDeltasLoading = useSelector(
    (x) => x.fitness.calorieDeltasLoading
  );
  console.log('calorie deltas loading ', calorieDeltasLoading);
  const { average_deficit, total_deficit, total_lbs } =
    useSelector((x) => x.fitness.calorieDeltas) ?? [];

  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Typography variant='h5'>Delta</Typography>
      </Grid>
      <Grid item lg={4}>
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom>
              Average Deficit
            </Typography>
            {!calorieDeltasLoading && (
              <Typography variant='h5'>{average_deficit} kcals</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={4}>
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom>
              Total Deficit
            </Typography>
            {!calorieDeltasLoading && (
              <Typography variant='h5'>{total_deficit} kcals</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={4}>
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom>
              Total Loss (By Deficit)
            </Typography>
            {!calorieDeltasLoading && (
              <Typography variant='h5'>{total_lbs} lbs</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={12}>
        {!calorieDeltasLoading && <DeltaChart />}
      </Grid>
    </Grid>
  );
};

export default DeltaChartSection;
