import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTimestampHoursBack } from '../../../api/helpers/scheduleHelpers';
import {
  closeDialog,
  dialogType,
} from '../../../store/dialog/dialogSlice';
import { getScheduleHistory } from '../../../store/schedule/scheduleActions';
import { ScheduleHistoryTable } from '../components/ScheduleHistoryTable';

const ScheduleHistoryViewDialog = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (x) => x.dialog[dialogType.scheduleHistoryViewDialog]
  );

  const [hoursBack, setHoursBack] = useState(4);

  const handleRefresh = () => {
    const startTimestamp = getTimestampHoursBack(hoursBack);
    dispatch(getScheduleHistory(Math.round(startTimestamp)));
  };

  const handleHoursBackChange = (event) => {
    setHoursBack(event.target.value);
  };

  const handleClose = () => {
    dispatch(closeDialog(dialogType.scheduleHistoryViewDialog));
  };

  useEffect(() => {
    if (hoursBack && hoursBack != 0) {
      const startTimestamp = getTimestampHoursBack(hoursBack);
      dispatch(getScheduleHistory(Math.round(startTimestamp)));
    }
  }, [hoursBack]);

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
            <Typography variant='h5'>Schedule History</Typography>
            <TextField
              label='Hours Back'
              value={hoursBack ?? 0}
              onChange={handleHoursBackChange}
              type='number'
            />
          </span>
        </Grid>
      </Grid>
      <DialogContent sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          <Grid item lg={6}></Grid>
          <Grid item lg={12}>
            <ScheduleHistoryTable />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRefresh}>Refresh</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export { ScheduleHistoryViewDialog };
