import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCountdownDisplay,
  toLocalDateTime,
} from '../../api/helpers/dateTimeUtils';
import { disarmDms, pollDms } from '../../store/dms/dmsActions';
import Spinner from '../Spinner';
import DashboardTitle from '../dashboard/DashboardTitle';

const StyledPaper = ({ el, children }) => {
  return (
    <Paper
      elevation={el}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Paper>
  );
};

const ReadOnlyTextField = ({ label, value }) => {
  return (
    <TextField
      label={label}
      value={value}
      variant='standard'
      fullWidth
      gutterBottom
      inputProps={{
        readOnly: true,
      }}
    />
  );
};

const DashboardDmsLayout = () => {
  const {
    dmsLoading = true,
    dms = {},
    disarm = {},
    disarmLoading = false,
  } = useSelector((x) => x.dms);

  const dispatch = useDispatch();

  const handlePoll = () => {
    dispatch(pollDms());
  };

  const handleDisarm = () => {
    dispatch(disarmDms());
  };

  useEffect(() => {
    dispatch(pollDms());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(pollDms(false));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledPaper el={1}>
      <Container spacing={3}>
        <Grid item lg={12}>
          <DashboardTitle>DMS</DashboardTitle>
        </Grid>
        <Grid item lg={12} xs={12} sx={{ marginBottom: '2rem' }}>
          <Typography variant='h5'>
            {getCountdownDisplay(dms?.seconds_remaining)}
          </Typography>
        </Grid>

        <Grid
          item
          lg={12}
          xs={12}
          sx={{ marginBottom: '1rem', minHeight: '20vh' }}>
          <Grid container spacing={3}>
            {dmsLoading || disarmLoading ? (
              <Spinner />
            ) : (
              <>
                <Grid item lg={4} xs={12}>
                  <ReadOnlyTextField
                    label='Expiration'
                    value={
                      toLocalDateTime(dms?.expiration_date) ?? '-'
                    }
                  />
                </Grid>
                <Grid item lg={4} xs={12}>
                  <ReadOnlyTextField
                    label='Last Disarm'
                    value={
                      toLocalDateTime(
                        dms?.switch?.last_disarm * 1000
                      ) ?? '-'
                    }
                  />
                </Grid>
                <Grid item lg={4} xs={12}>
                  <ReadOnlyTextField
                    label='Last Touched'
                    value={
                      toLocalDateTime(
                        dms?.switch?.last_touched * 1000
                      ) ?? '-'
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        <Grid item lg={3} align='right'>
          <ButtonGroup>
            <Button onClick={handlePoll}>Poll</Button>
            <Button onClick={handleDisarm}>Disarm</Button>
          </ButtonGroup>
        </Grid>
      </Container>
    </StyledPaper>
  );
};

export { DashboardDmsLayout };