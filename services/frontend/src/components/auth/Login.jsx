import { Button, Grid } from '@mui/material';
import React from 'react';
import { loginRequest } from '../../msalConfig';
import { useMsal } from '@azure/msal-react';

export default function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  return (
    <Grid
      container
      id='login-container'
      spacing={0}
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '60vh' }}>
      <Grid item xs={3} id='login-form-container'>
        <h1 style={{ textAlign: 'center' }}>Tools</h1>
        <Grid>
          <Grid style={{ margin: 5 }} id='login-passcode-container'>
            <Button variant='contained' onClick={handleLogin}>
              Sign In
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
