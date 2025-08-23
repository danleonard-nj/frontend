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
import { featureType } from '../../../api/helpers/featureHelpers';
import {
  closeDialog,
  dialogType,
} from '../../../store/dialog/dialogSlice';
import { createFeature } from '../../../store/features/featureActions';
import {
  setCreateFeatureDialog,
  updateFeature,
} from '../../../store/features/featureSlice';

export default function CreateFeatureDialog() {
  const dispatch = useDispatch();
  const feature = useSelector((x) => x.feature.feature);
  const createFeatureOpen = useSelector(
    (x) => x.dialog[dialogType.createFeatureDialog]
  );

  const handleClose = () => {
    dispatch(closeDialog(dialogType.createFeatureDialog));
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
    dispatch(createFeature(feature));
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
                    <InputLabel id='select-feature-label'>
                      Feature Type
                    </InputLabel>

                    <Select
                      labelId='select-feature-label'
                      label='Feature Type'
                      name='feature_type'
                      onChange={handleChange}
                      value={feature.feature_id}
                      fullWidth>
                      {Object.keys(featureType).map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} align='center'>
                  {feature.feature_type == featureType.boolean && (
                    <FormControl>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label='Enabled'
                      />
                    </FormControl>
                  )}
                  {feature.feature_type == featureType.text && (
                    <TextField
                      label='Value'
                      name='value'
                      fullWidth
                      variant='standard'
                      value={feature?.value ?? ''}
                      onChange={handleChange}
                    />
                  )}
                  {feature.feature_type == featureType.json && (
                    <TextField
                      label='JSON'
                      name='value'
                      fullWidth
                      variant='standard'
                      value={feature?.value ?? ''}
                      onChange={handleChange}
                    />
                  )}
                  {feature.feature_type == featureType.number && (
                    <TextField
                      label='Value'
                      name='value'
                      type='number'
                      fullWidth
                      variant='standard'
                      value={feature?.value ?? ''}
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
