import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slider,
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
import Spinner from '../../Spinner';

const ScheduleHistoryViewDialog = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (x) => x.dialog[dialogType.scheduleHistoryViewDialog]
  );

  const scheduleHistoryLoading =
    useSelector((x) => x.schedule.scheduleHistoryLoading) ?? [];

  const [hoursBack, setHoursBack] = useState(4);

  const handleLoadHistoryData = () => {
    const startTimestamp = getTimestampHoursBack(hoursBack);
    dispatch(getScheduleHistory(Math.round(startTimestamp)));
  };

  const handleSliderChange = (event) => {
    setHoursBack(event.target.value);
  };

  const handleClose = () => {
    dispatch(closeDialog(dialogType.scheduleHistoryViewDialog));
  };

  useEffect(() => {
    handleLoadHistoryData();
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth>
      <Grid container>
        <Grid item lg={6}>
          <DialogTitle>Schedule History</DialogTitle>
        </Grid>
        <Grid item lg={6} justifyContent='flex-end'>
          <Box sx={{ display: 'inline-block', width: '100%', p: 2 }}>
            <Typography id='input-slider' gutterBottom>
              Hours Back
            </Typography>
            <Slider
              value={hoursBack ?? 0}
              onChange={handleSliderChange}
              onChangeCommitted={handleLoadHistoryData}
              valueLabelDisplay='auto'
            />
          </Box>
        </Grid>
      </Grid>
      <DialogContent sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          <Grid item lg={6}></Grid>
          <Grid item lg={12}>
            {scheduleHistoryLoading ? (
              <Spinner />
            ) : (
              <ScheduleHistoryTable />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export { ScheduleHistoryViewDialog };
