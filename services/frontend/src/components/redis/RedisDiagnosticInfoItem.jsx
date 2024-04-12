import { Grid, TextField, Typography } from '@mui/material';
import React from 'react';

const RedisDiagnosticInfoItem = ({ label, value }) => {
  return (
    <Grid item lg={12}>
      <TextField
        label={label}
        value={value}
        fullWidth
        InputProps={{ readOnly: true }}
      />
    </Grid>
  );
};

export { RedisDiagnosticInfoItem };
