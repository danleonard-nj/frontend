import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDialog,
  dialogType,
} from '../../../store/dialog/dialogSlice';
import { setEmailRule } from '../../../store/email/emailSlice';
import { actionType } from '../../../api/data/email';
import {
  clearEmailRule,
  createEmailRule,
} from '../../../store/email/emailActions';

const CreateEmailRuleDialog = () => {
  const dispatch = useDispatch();

  const { emailRule } = useSelector((x) => x.email);
  const createDialogOpen = useSelector(
    (x) => x.dialog[dialogType.createEmailRuleDialog]
  );

  const handleChange = (value, field) => {
    dispatch(
      setEmailRule({
        ...emailRule,
        [field]: value,
      })
    );

    console.log(emailRule);
  };

  const handleClose = () => {
    dispatch(clearEmailRule());
    dispatch(closeDialog(dialogType.createEmailRuleDialog));
  };

  const handleCreateRule = () => {
    dispatch(createEmailRule(emailRule));
    dispatch(closeDialog(dialogType.createEmailRuleDialog));
  };

  return (
    <Dialog open={createDialogOpen} onClose={handleClose}>
      <DialogTitle>Create Email Rule</DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography component='h2' variant='h6' color='white'>
                Email Rule
              </Typography>
              <Grid container spacing={3}>
                <Grid item lg={6}>
                  <TextField
                    label='Name'
                    name='name'
                    fullWidth
                    variant='standard'
                    value={emailRule?.name}
                    onChange={(event) =>
                      handleChange(
                        event.target.value,
                        event.target.name
                      )
                    }
                  />
                </Grid>
                <Grid item lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id='select-action-type-label'>
                      Action
                    </InputLabel>
                    <Select
                      labelId='select-action-type-label'
                      value={emailRule?.action ?? ''}
                      name='action'
                      label='Action'
                      onChange={(event) =>
                        handleChange(
                          event.target.value,
                          event.target.name
                        )
                      }>
                      {Object.values(actionType).map((actionType) => (
                        <MenuItem key={actionType} value={actionType}>
                          {actionType}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12}>
                  <TextField
                    label='Description'
                    name='description'
                    fullWidth
                    variant='standard'
                    value={emailRule?.description}
                    onChange={(event) =>
                      handleChange(
                        event.target.value,
                        event.target.name
                      )
                    }
                  />
                </Grid>
                <Grid item lg={12}>
                  <TextField
                    label='Query'
                    name='query'
                    fullWidth
                    variant='standard'
                    value={emailRule?.query}
                    onChange={(event) =>
                      handleChange(
                        event.target.value,
                        event.target.name
                      )
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreateRule}>Create</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export { CreateEmailRuleDialog };
