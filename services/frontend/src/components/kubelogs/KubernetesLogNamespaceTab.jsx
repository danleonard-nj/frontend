import { Grid, Paper } from '@mui/material';
import { KubernetesNamespaceList } from './KubernetesNamespaceList';

const KubernetesLogNamespaceTab = () => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={2}>
        <Paper sx={{ p: 2 }}>
          <KubernetesNamespaceList />
        </Paper>
      </Grid>
    </Grid>
  );
};

export { KubernetesLogNamespaceTab };
