import { Grid } from '@mui/material';
import { KubernetesLogs } from './KubernetesLogsContainer';

const KubernetesLogsTab = () => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={12} xs={12} sm={12} md={12}>
        <KubernetesLogs />
      </Grid>
    </Grid>
  );
};

export { KubernetesLogsTab };
