import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  styled,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateScheduleState } from '../../../store/schedule/scheduleActions';
import Spinner from '../../Spinner';
import { ScheduleToolbar } from './ScheduleToolbar';

const ScheduleDetailStyledPaper = styled(Paper)({
  p: 2,
  minHeight: '8rem',
  display: 'flex',
  flexDirection: 'column',
});

const FormControlFlexLabel = styled(FormControlLabel)({
  display: 'flex',
});

const ScheduleDetail = () => {
  const dispatch = useDispatch();

  const { schedule, scheduleLoading } = useSelector(
    (x) => x.schedule
  );

  const handleSecondsCheckboxChange = (event) => {
    dispatch(
      updateScheduleState((schedule) => ({
        ...schedule,
        includeSeconds: event.target.checked,
      }))
    );
  };

  const handleActiveCheckboxChange = (event) => {
    dispatch(
      updateScheduleState((schedule) => ({
        ...schedule,
        isActive: event.target.checked,
      }))
    );
  };

  const handleChange = (value, name) => {
    dispatch(
      updateScheduleState((schedule) => ({
        ...schedule,
        [name]: value,
      }))
    );
  };

  return (
    <>
      <Grid item lg={12} xs={12} id='schedule-layout-grid'>
        <ScheduleDetailStyledPaper>
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
                  <FormControlFlexLabel
                    id='schedule-seconds-checkbox-form-control'
                    control={
                      <Checkbox
                        id='schedule-seconds-checkbox'
                        checked={schedule?.includeSeconds ?? false}
                        onChange={handleSecondsCheckboxChange}
                      />
                    }
                    label='Seconds'
                    labelPlacement='end'
                  />
                </Grid>
                <Grid
                  item
                  lg
                  xs={4}
                  id='schedule-active-checkbox-container'>
                  <FormControlFlexLabel
                    id='schedule-active-checkbox-form-control'
                    control={
                      <Checkbox
                        id='schedule-seconds-checkbox'
                        checked={schedule?.isActive ?? false}
                        onChange={handleActiveCheckboxChange}
                      />
                    }
                    label='Active'
                    labelPlacement='end'
                  />
                </Grid>
              </Grid>
            </>
          )}
        </ScheduleDetailStyledPaper>
      </Grid>
    </>
  );
};

export { ScheduleDetail };
