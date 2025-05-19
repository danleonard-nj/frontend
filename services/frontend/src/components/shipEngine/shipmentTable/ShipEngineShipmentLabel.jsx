import {
  Card,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Spinner from '../../Spinner';
import {
  ShipEngineVoidLabelButton,
  ShipEngineCreateLabelButton,
} from './components/ShipEngineCreateLabelButton';
import ShipEngineLabelDetailTable from './components/ShipEngineLabelDetailTable';

export default function ShipEngineShipmentLabelDetail() {
  const labelLoading = useSelector((x) => x.shipEngine.labelLoading);
  const label = useSelector((x) => x.shipEngine.label);

  console.log(label);

  const showLabelDetails = () => {
    return label?.details?.label !== null;
  };

  const isVoided = label?.details?.voided;

  return (
    <Card elevation={3} sx={{ padding: 1 }}>
      <Grid container spacing={3}>
        {labelLoading ? (
          <Grid item lg={12}>
            <Container>
              <Spinner />
            </Container>
          </Grid>
        ) : showLabelDetails() ? (
          <>
            <Grid item lg={6}>
              <Typography variant='h5'>Label</Typography>
            </Grid>
            <Grid item lg={6} align='right'>
              {showLabelDetails() && !isVoided && (
                <ShipEngineVoidLabelButton />
              )}
              {isVoided && (
                <Paper
                  color='error'
                  sx={{ padding: 1, textAlign: 'center' }}>
                  <Typography
                    component='span'
                    color='error'
                    sx={{ verticalAlign: 'middle', mr: 1 }}>
                    &#33;
                  </Typography>
                  <Typography
                    variant='subtitle'
                    color='error'
                    textAlign='center'>
                    Voided: {label?.details?.voided_date}
                  </Typography>
                </Paper>
              )}
            </Grid>
            <Grid item lg={12}>
              <ShipEngineLabelDetailTable />
            </Grid>
          </>
        ) : (
          <ShipEngineCreateLabelButton />
        )}
      </Grid>
    </Card>
  );
}
