import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateScheduleState } from '../../../store/schedule/scheduleActions';
import Spinner from '../../Spinner';
import { ScheduleToolbar } from './ScheduleToolbar';
import { setIsScheduleModified } from '../../../store/schedule/scheduleSlice';

const ScheduleDetailPaper = ({ children }) => (
  <Paper
    sx={{
      p: 2,
      minHeight: '8rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
    {children}
  </Paper>
);

export default function ScheduleDetail() {
  const {
    schedule = {},
    scheduleLoading = true,
    isScheduleModified = false,
  } = useSelector((store) => store.schedule);

  const dispatch = useDispatch();

  const setScheduleMofided = () => {
    if (!isScheduleModified) {
      dispatch(setIsScheduleModified(true));
    }
  };

  const handleSecondsCheckboxChange = (event) => {
    dispatch(
      updateScheduleState((schedule) => ({
        ...schedule,
        includeSeconds: event.target.checked,
      }))
    );

    setScheduleMofided();
  };

  const handleActiveCheckboxChange = (event) => {
    dispatch(
      updateScheduleState((schedule) => ({
        ...schedule,
        isActive: event.target.checked,
      }))
    );

    setScheduleMofided();
  };

  const handleChange = (value, name) => {
    dispatch(
      updateScheduleState((schedule) => ({
        ...schedule,
        [name]: value,
      }))
    );

    setScheduleMofided();
  };

  return (
    <Grid item lg={12} xs={12} id='schedule-layout-grid'>
      <ScheduleDetailPaper>
        {scheduleLoading ? (
          <Spinner />
        ) : (
          <>
            <ScheduleToolbar />
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sm={6}
                lg={6}
                id='schedule-name-textbox-grid-item'>
                <TextField
                  required
                  id='schedule-name-textbox'
                  name='scheduleName'
                  label='Schedule Name'
                  value={schedule?.scheduleName ?? ''}
                  onChange={(event) =>
                    handleChange(
                      event.target.value,
                      event.target.name
                    )
                  }
                  fullWidth
                  variant='standard'
                />
              </Grid>

              <Grid item lg xs={8}>
                <TextField
                  required
                  value={schedule.cron}
                  id='schedule-cron-textbox-grid-item'
                  name='cron'
                  label='CRON'
                  fullWidth
                  variant='standard'
                  onChange={(event) =>
                    handleChange(event.target.value, 'cron')
                  }
                />
              </Grid>
              <Grid
                item
                lg
                xs={4}
                id='schedule-seconds-checkbox-container'>
                <FormControlLabel
                  id='schedule-seconds-checkbox-form-control'
                  control={
                    <Checkbox
                      id='schedule-seconds-checkbox'
                      checked={schedule?.includeSeconds ?? false}
                      onChange={handleSecondsCheckboxChange}
                    />
                  }
                  label='Seconds'
                  sx={{ display: 'flex' }}
                  labelPlacement='end'
                />
              </Grid>
              <Grid
                item
                lg
                xs={4}
                id='schedule-active-checkbox-container'>
                <FormControlLabel
                  id='schedule-active-checkbox-form-control'
                  control={
                    <Checkbox
                      id='schedule-seconds-checkbox'
                      checked={schedule?.isActive ?? false}
                      onChange={handleActiveCheckboxChange}
                    />
                  }
                  label='Active'
                  sx={{ display: 'flex' }}
                  labelPlacement='end'
                />
              </Grid>
            </Grid>
          </>
        )}
      </ScheduleDetailPaper>
    </Grid>
  );
}
