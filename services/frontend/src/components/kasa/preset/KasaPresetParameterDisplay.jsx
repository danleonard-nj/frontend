import { Grid, TextField } from '@mui/material';

export default function PresetParameterDisplay({ preset }) {
  return (
    <>
      <Grid item lg={6} xs={12}>
        <TextField
          fullWidth
          label='Hue'
          value={preset?.definition?.hue ?? ''}
          InputProps={{
            readOnly: true,
          }}
          variant='filled'
        />
      </Grid>
      <Grid item lg={6} xs={12}>
        <TextField
          fullWidth
          label='Saturation'
          value={preset?.definition?.saturation ?? ''}
          InputProps={{
            readOnly: true,
          }}
          variant='filled'
        />
      </Grid>
      <Grid item lg={6} xs={12}>
        <TextField
          fullWidth
          label='Temperature'
          value={preset?.definition?.temperature ?? ''}
          InputProps={{
            readOnly: true,
          }}
          variant='filled'
        />
      </Grid>
      <Grid item lg={6} xs={12}>
        <TextField
          fullWidth
          label='Brightness'
          value={preset?.definition?.brightness ?? ''}
          InputProps={{
            readOnly: true,
          }}
          variant='filled'
        />
      </Grid>
      <Grid item lg={6} xs={12}>
        <TextField
          fullWidth
          label='State'
          value={preset?.definition?.state ? 'true' : 'false'}
          InputProps={{
            readOnly: true,
          }}
          variant='filled'
        />
      </Grid>
    </>
  );
}
