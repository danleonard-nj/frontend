import { Grid, Paper } from '@mui/material';
import { KubernetesPodList } from './KubernetesPodList';

const KubernetesPodTab = () => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={2}>
        <Paper sx={{ p: 2 }}>
          <KubernetesPodList />
        </Paper>
      </Grid>
    </Grid>
  );
};

export { KubernetesPodTab };
