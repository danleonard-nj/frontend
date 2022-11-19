import { Card, CardContent, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import DeviceCardContent from './task/DeviceCardContent';

export default function DeviceCard() {
  const device = useSelector((x) => x.device.device);

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant='h5' component='div'>
          {device?.device_name ?? ''}
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12}>
            <DeviceCardContent />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
