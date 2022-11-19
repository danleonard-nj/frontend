import { Grid, Paper, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFeature } from '../../../store/features/featureActions';
import {
  setCreateFeatureDialog,
  updateFeature,
} from '../../../store/features/featureSlice';

const featureTypes = [
  {
    name: 'Boolean',
    value: 1,
  },
  {
    name: 'String',
    value: 2,
  },
  {
    name: 'Array',
    value: 3,
  },
];
export default function CreateFeatureDialog() {
  const dispatch = useDispatch();
  const createFeatureOpen = useSelector((x) => x.feature.createFeatureOpen);
  const feature = useSelector((x) => x.feature.feature);

  const handleClose = () => {
    dispatch(setCreateFeatureDialog(false));
  };

  const handleChange = (event) => {
    dispatch(
      updateFeature((feature) => ({
        ...feature,
        [event.target.name]: event.target.value,
      }))
    );
  };

  const getFeatureKey = (name) => {
    return name.toLowerCase().split(' ').join('-');
  };

  useEffect(() => {
    dispatch(
      updateFeature((feature) => ({
        ...feature,
        feature_key: getFeatureKey(feature.name),
      }))
    );
  }, [feature.name]);

  const handleCreate = () => {
    dispatch(createFeature());
  };

  return (
    <Dialog open={createFeatureOpen} onClose={handleClose}>
      <DialogTitle>Create Feature</DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography component='h2' variant='h6' color='white'>
                Feature
              </Typography>
              <Grid container spacing={3}>
                <Grid item lg={6}>
                  <TextField
                    label='Name'
                    name='name'
                    fullWidth
                    variant='standard'
                    value={feature.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item lg={6}>
                  <TextField
                    label='Feature Key'
                    name='feature_key'
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    variant='standard'
                    value={feature.feature_key}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item lg={12}>
                  <TextField
                    label='Feature Description'
                    name='description'
                    fullWidth
                    variant='standard'
                    onChange={handleChange}
                    value={feature.description}
                  />
                </Grid>

                <Grid item lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                      Feature Type
                    </InputLabel>

                    <Select
                      labelId='demo-simple-select-label'
                      label='Feature Type'
                      name='type_id'
                      onChange={handleChange}
                      value={feature.feature_id}
                      fullWidth>
                      {featureTypes.map((type) => (
                        <MenuItem value={type.value}>{type.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} align='center'>
                  {feature.type_id == 1 && (
                    <FormControl>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label='Enabled'
                      />
                    </FormControl>
                  )}
                  {feature.type_id == 2 && (
                    <TextField
                      label='Value'
                      name='value'
                      fullWidth
                      variant='standard'
                      value={feature.value}
                      onChange={handleChange}
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate}>Create</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
