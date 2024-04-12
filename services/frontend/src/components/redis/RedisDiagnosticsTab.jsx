import { Grid, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { snakeCaseToNormal } from '../../api/helpers/redisHelpers';
import { getRedisDiagnostics } from '../../store/redis/redisActions';

const RedisDiagnosticsTab = () => {
  const dispatch = useDispatch();

  const { redisDiagnostics = {}, redisDiagnosticsLoading = true } =
    useSelector((x) => x.redis);

  useEffect(() => {
    dispatch(getRedisDiagnostics());
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item lg={6}>
        <Grid item lg={12}>
          <Typography variant='h5'>Diagnostics</Typography>
        </Grid>
        <Grid item lg={12}>
          {Object.keys(redisDiagnostics?.server?.info).map((key) => (
            <Grid item lg={4}>
              <TextField
                key={key}
                label={snakeCaseToNormal(key)}
                value={redisDiagnostics?.server?.info[key]}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {Object.keys(redisDiagnostics?.stats?.memory).map((key) => (
        <Grid item lg={4}>
          <TextField
            key={key}
            label={snakeCaseToNormal(key)}
            value={redisDiagnostics?.server?.info[key]}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
      ))}
    </Grid>
  );
};

export { RedisDiagnosticsTab };
