import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featureType } from '../../../api/helpers/featureHelpers';
import {
  closeDialog,
  dialogType,
} from '../../../store/dialog/dialogSlice';
import { updateFeatureValue } from '../../../store/features/featureActions';

export default function EditFeatureDialog() {
  const dispatch = useDispatch();
  const open = useSelector(
    (x) => x.dialog[dialogType.editFeatureDialog]
  );
  const feature = useSelector((x) => x.feature.editFeature);
  const [value, setValue] = useState(feature?.value ?? '');

  useEffect(() => {
    setValue(feature?.value ?? '');
  }, [feature]);

  if (!feature || feature.feature_type !== featureType.text)
    return null;

  const handleClose = () => {
    dispatch(closeDialog(dialogType.editFeatureDialog));
  };

  const handleSave = () => {
    dispatch(updateFeatureValue(feature.feature_key, value));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Edit Feature</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography component='h2' variant='h6' gutterBottom>
                {feature.name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label='Feature Key'
                    value={feature.feature_key}
                    fullWidth
                    variant='standard'
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Description'
                    value={feature.description ?? ''}
                    fullWidth
                    variant='standard'
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Value'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    variant='standard'
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant='contained'>
          Save
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
