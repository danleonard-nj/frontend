import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventHistory } from '../../store/apiEvents/apiEventActions';
import { GenericJsonEditor } from '../GenericJsonEditor';
import Spinner from '../Spinner';

const defaultHoursBack = 1;
const jsonTableHeight = 250;

const formatDate = (timestamp) => {
  if (timestamp == null || timestamp == 0) {
    return 'Invalid';
  }

  return new Date(timestamp * 1000).toLocaleString();
};

const getFormattedEventKey = (event) =>
  event?.endpoint === 'http://kasa/api/event/device/response' &&
  !event?.key
    ? 'Kasa Device Response'
    : event?.key ?? 'N/A';

const formatJson = (data) => {
  return data ? JSON.stringify(data, null, 4) : '';
};

const EventHistoryDetail = ({ event }) => {
  return (
    <Grid container>
      <Grid item lg={12} sm={12} xs={12}>
        <Table sx={{ marginTop: '2rem' }}>
          <TableBody>
            <TableRow>
              <TableCell>Log ID</TableCell>
              <TableCell>{event?.log_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Event Date</TableCell>
              <TableCell>{formatDate(event?.timestamp)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Endpoint</TableCell>
              <TableCell>{event?.endpoint}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Method</TableCell>
              <TableCell>{event?.message?.method}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
      <Grid item lg={6} sm={12} xs={12}>
        <Typography
          variant='h6'
          gutterBottom
          sx={{ marginTop: '1rem' }}>
          Message
        </Typography>

        <GenericJsonEditor
          value={formatJson(event?.message)}
          height={jsonTableHeight}
        />
      </Grid>
      {event?.response && (
        <Grid item lg={6} sm={12} xs={12}>
          <Typography
            variant='h6'
            gutterBottom
            sx={{ marginTop: '1rem' }}>
            Response
          </Typography>

          <GenericJsonEditor
            value={formatJson(event?.response)}
            height={jsonTableHeight}
          />
        </Grid>
      )}
    </Grid>
  );
};

const EventHistoryTable = () => {
  const { events = [], eventsLoading = true } = useSelector(
    (x) => x.apiEvents
  );

  const [expanded, setExpanded] = useState('');

  const handleExpandRow = (event) => {
    setExpanded(event.log_id === expanded ? '' : event.log_id);
  };

  const ExpandButton = ({ isExpanded, row }) => {
    return (
      <IconButton
        aria-label='expand row'
        sx={{ margin: 'auto' }}
        onClick={() => handleExpandRow(row)}>
        {isExpanded ? (
          <KeyboardArrowUpIcon />
        ) : (
          <KeyboardArrowDownIcon />
        )}
      </IconButton>
    );
  };

  const TableContent = () => (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Event Key</TableCell>
          <TableCell>Endpoint</TableCell>
          <TableCell>Timestamp</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((event) => (
          <>
            <TableRow key={event.log_id}>
              <TableCell>
                <ExpandButton
                  isExpanded={event.log_id === expanded}
                  row={event}
                />
              </TableCell>
              <TableCell>{getFormattedEventKey(event)}</TableCell>
              <TableCell>{event?.endpoint}</TableCell>
              <TableCell>
                {new Date(event.timestamp * 1000).toLocaleString()}
              </TableCell>
              <TableCell>{event?.status_code}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{ border: 0, paddingTop: 0, paddingBottom: 0 }}
                colSpan={12}>
                <Collapse
                  in={event.log_id === expanded}
                  timeout='auto'
                  unmountOnExit>
                  <EventHistoryDetail event={event} />
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );

  return eventsLoading ? <Spinner /> : <TableContent />;
};

const HourSlider = ({ hoursBack, setHoursBack }) => {
  const [sliderValue, setSliderValue] = useState(hoursBack);

  return (
    <Box sx={{ width: 300 }}>
      <Typography gutterBottom align='left'>
        Hours Back: {hoursBack}
      </Typography>
      <Slider
        value={sliderValue}
        onChange={(e, v) => setSliderValue(v)}
        onChangeCommitted={(e, v) => setHoursBack(v)}
        min={1}
        max={24}
        step={1}
        aria-label='Small'
        valueLabelDisplay='auto'
      />
    </Box>
  );
};

const getTimestampHoursBack = (hoursBack) => {
  return (
    Math.round(new Date().getTime() / 1000) - 60 * 60 * hoursBack
  );
};

const DashboardApiEventHistoryLayout = () => {
  const [hoursBack, setHoursBack] = useState(defaultHoursBack);
  const [startTimestamp, setStartTimestamp] = useState(
    getTimestampHoursBack(defaultHoursBack)
  );

  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(getEventHistory(startTimestamp));
  };

  useEffect(() => {
    dispatch(getEventHistory(startTimestamp));
  }, []);

  useEffect(() => {
    setStartTimestamp(getTimestampHoursBack(hoursBack));
    dispatch(getEventHistory(getTimestampHoursBack(hoursBack)));
  }, [hoursBack]);

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container>
        <Grid item lg={6}>
          <h1>API Event History</h1>
        </Grid>
        <Grid item lg={6} align='right'>
          <Button onClick={handleRefresh}>Refresh</Button>
          <HourSlider
            hoursBack={hoursBack}
            setHoursBack={setHoursBack}
          />
        </Grid>
        <Grid item lg={12}>
          <EventHistoryTable />
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardApiEventHistoryLayout };
