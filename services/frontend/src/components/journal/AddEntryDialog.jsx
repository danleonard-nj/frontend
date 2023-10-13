import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDialog,
  dialogType,
} from '../../store/dialog/dialogSlice';

const AddEntryDialog = () => {
  const isOpen = useSelector(
    (x) => x.dialog[dialogType.journalAddEntryDialog]
  );

  const handleCreate = () => {};

  const handleClose = () => {
    dispatch(closeDialog(dialogType.journalAddEntryDialog));
  };

  const dispatch = useDispatch();

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth>
      <Grid container spacing={3}>
        <Grid item lg={12} sm={12} xs={12}>
          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1rem',
            }}>
            <Typography variant='h5'>Add Entry</Typography>
            {/* <Box sx={{ p: 2 }}> */}
            {/* <TextField
              label='Hours Back'
              value={hoursBack ?? 0}
              onChange={handleHoursBackChange}
              type='number'
            /> */}
            {/* <Typography id='input-slider' gutterBottom>
            Hours Back
          </Typography>
          <Slider
            value={hoursBack ?? 0}
            onChange={handleSliderChange}
            valueLabelDisplay='auto'
          /> */}
            {/* </Box> */}
          </span>
        </Grid>
      </Grid>
      <DialogContent sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          <Grid item lg={6}></Grid>
          <Grid item lg={12}>
            <h1>placeholder</h1>
            {/* <ScheduleHistoryTable /> */}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate}>Create</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export { AddEntryDialog };
