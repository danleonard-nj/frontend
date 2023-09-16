import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCountdownDisplay,
  toLocalDateTime,
} from '../../api/helpers/dateTimeUtils';
import {
  disarmDms,
  getHistory,
  pollDms,
} from '../../store/dms/dmsActions';
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

const HistoryTable = ({ history = [] }) => {
  const [data, setData] = React.useState([]);

  useEffect(() => {
    let sortedHistory = [...history];

    sortedHistory.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });

    setData(sortedHistory);
  }, [history]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data?.map((row) => (
          <TableRow hover key={row.history_id}>
            <TableCell component='th' scope='row'>
              {new Date(row.timestamp * 1000).toLocaleString()}
            </TableCell>
            <TableCell>{row.operation}</TableCell>
            <TableCell>{row.username}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const HistoryTableContainer = () => {
  const [daysBack, setDaysBack] = React.useState(1);

  const { history, historyLoading } = useSelector((x) => x.dms);

  const dispatch = useDispatch();

  const handleSetDaysBack = (e) => {
    setDaysBack(e.target.value ?? 1);
  };

  useEffect(() => {
    dispatch(getHistory(daysBack));
  }, [daysBack]);

  return (
    <Paper elevation={2} sx={{ p: 2, marginTop: '1rem' }}>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Typography variant='h5' align='left'>
          History
        </Typography>
        <TextField
          type='number'
          label='Days'
          variant='standard'
          value={daysBack}
          onChangeCapture={handleSetDaysBack}
        />
      </span>

      {historyLoading ? (
        <Spinner />
      ) : (
        <HistoryTable history={history} />
      )}
      <Button
        onClick={() => dispatch(getHistory(daysBack))}
        sx={{ marginTop: '1rem' }}>
        Refresh
      </Button>
    </Paper>
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
    }, 750);
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
                      new Date(
                        dms?.expiration_date * 1000
                      ).toLocaleString() ?? '-'
                    }
                  />
                </Grid>
                <Grid item lg={4} xs={12}>
                  <ReadOnlyTextField
                    label='Last Disarm'
                    value={
                      toLocalDateTime(
                        new Date(dms?.switch?.last_disarm * 1000)
                      ) ?? '-'
                    }
                  />
                </Grid>
                <Grid item lg={4} xs={12}>
                  <ReadOnlyTextField
                    label='Last Touched'
                    value={
                      toLocalDateTime(
                        new Date(dms?.switch?.last_touched * 1000)
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
        <Grid item lg={12} xs={12}>
          <HistoryTableContainer />
        </Grid>
      </Container>
    </StyledPaper>
  );
};

export { DashboardDmsLayout };
