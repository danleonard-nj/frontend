import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getLogs } from '../../store/kubeLogs/kubeLogActions';
import {
  setLogTail,
  setLogs,
} from '../../store/kubeLogs/kubeLogSlice';
import LogViewer from './LogViewer';
import Spinner from '../Spinner';

const STREAMING_INTERVALS = {
  'Real-time (1s)': 1000,
  'Fast (3s)': 3000,
  'Normal (5s)': 5000,
  'Slow (10s)': 10000,
};

const TAIL_OPTIONS = [
  { value: 100, label: '100 lines' },
  { value: 500, label: '500 lines' },
  { value: 1000, label: '1,000 lines' },
  { value: 5000, label: '5,000 lines' },
  { value: 10000, label: '10,000 lines' },
  { value: 0, label: 'All logs' },
];

const EnhancedKubernetesLogs = () => {
  const dispatch = useDispatch();
  const {
    logs,
    logsLoading,
    logTail,
    selectedPod,
    selectedNamespace,
  } = useSelector((x) => x.kubeLogs);

  // Local state for streaming and UI
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingInterval, setStreamingInterval] =
    useState('Normal (5s)');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [accumulatedLogs, setAccumulatedLogs] = useState([]);
  const [lastLogCount, setLastLogCount] = useState(0);

  const streamingIntervalRef = useRef(null);
  const isComponentMounted = useRef(true);
  const dropdownInteractionRef = useRef(false);

  // Initialize accumulated logs when logs change from Redux
  useEffect(() => {
    if (logs && logs.length > 0 && !dropdownInteractionRef.current) {
      setAccumulatedLogs(logs);
      setLastLogCount(logs.length);
    }
  }, [logs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMounted.current = false;
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const showNotification = useCallback(
    (message, severity = 'info') => {
      setAlertMessage(message);
      setAlertSeverity(severity);
      setShowAlert(true);
    },
    []
  );

  const fetchLogs = useCallback(
    async (isStreamingCall = false) => {
      if (!selectedNamespace || !selectedPod) {
        if (!isStreamingCall) {
          showNotification(
            'Please select a namespace and pod first',
            'warning'
          );
        }
        return;
      }

      try {
        await dispatch(getLogs(selectedNamespace, selectedPod));

        if (isStreamingCall) {
          // Check if new logs were added
          const currentLogCount = logs?.length || 0;
          if (currentLogCount > lastLogCount) {
            const newLogsCount = currentLogCount - lastLogCount;
            showNotification(
              `${newLogsCount} new log entries received`,
              'success'
            );
            setLastLogCount(currentLogCount);
          }
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        showNotification('Failed to fetch logs', 'error');
      }
    },
    [
      dispatch,
      selectedNamespace,
      selectedPod,
      logs?.length,
      lastLogCount,
      showNotification,
    ]
  );

  const startStreaming = useCallback(() => {
    if (!selectedNamespace || !selectedPod) {
      showNotification(
        'Please select a namespace and pod before starting stream',
        'warning'
      );
      return;
    }

    setIsStreaming(true);
    showNotification(
      `Started streaming logs every ${streamingInterval.toLowerCase()}`,
      'info'
    );

    const intervalMs = STREAMING_INTERVALS[streamingInterval];

    streamingIntervalRef.current = setInterval(() => {
      if (isComponentMounted.current) {
        fetchLogs(true);
      }
    }, intervalMs);
  }, [
    selectedNamespace,
    selectedPod,
    streamingInterval,
    fetchLogs,
    showNotification,
  ]);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    showNotification('Stopped streaming logs', 'info');
  }, [showNotification]);

  const toggleStreaming = useCallback(() => {
    if (isStreaming) {
      stopStreaming();
    } else {
      startStreaming();
    }
  }, [isStreaming, startStreaming, stopStreaming]);

  const handleRefresh = useCallback(() => {
    fetchLogs(false);
  }, [fetchLogs]);

  const handleClearLogs = useCallback(() => {
    setAccumulatedLogs([]);
    dispatch(setLogs([]));
    setLastLogCount(0);
    showNotification('Logs cleared', 'info');
  }, [dispatch, showNotification]);

  const handleLogTailChange = useCallback(
    (event) => {
      const newTail = event.target.value;
      dispatch(setLogTail(newTail));

      // If streaming is active, restart it with new tail value
      if (isStreaming) {
        stopStreaming();
        setTimeout(() => {
          startStreaming();
        }, 100);
      }
    },
    [dispatch, isStreaming, stopStreaming, startStreaming]
  );

  const handleStreamingIntervalChange = useCallback(
    (event) => {
      const newInterval = event.target.value;
      setStreamingInterval(newInterval);

      // If streaming is active, restart it with new interval
      if (isStreaming) {
        // Stop current streaming immediately
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }

        // Start new streaming with updated interval (no state changes to avoid re-render)
        const intervalMs = STREAMING_INTERVALS[newInterval];
        streamingIntervalRef.current = setInterval(() => {
          if (isComponentMounted.current) {
            fetchLogs(true);
          }
        }, intervalMs);

        // Show notification after a delay to avoid interfering with dropdown
        setTimeout(() => {
          showNotification(
            `Updated stream interval to ${newInterval.toLowerCase()}`,
            'success'
          );
        }, 500);
      }
    },
    [isStreaming, showNotification, fetchLogs]
  );

  // Auto-fetch logs when pod/namespace changes
  useEffect(() => {
    if (selectedNamespace && selectedPod) {
      // Clear existing logs immediately to show loading state
      setAccumulatedLogs([]);
      dispatch(setLogs([]));
      setLastLogCount(0);

      // Fetch initial logs
      fetchLogs(false);
    }
  }, [selectedNamespace, selectedPod, logTail, dispatch]);

  const LogControls = () => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12} md={6}>
          <Stack
            direction='row'
            spacing={2}
            alignItems='center'
            flexWrap='wrap'>
            <Typography variant='h6'>Live Log Streaming</Typography>
            {selectedNamespace && selectedPod && (
              <Chip
                label={`${selectedNamespace}/${selectedPod}`}
                variant='outlined'
                size='small'
                sx={{ fontFamily: 'monospace' }}
              />
            )}
            {isStreaming && (
              <Chip
                label={`● LIVE (${streamingInterval})`}
                color='success'
                size='small'
                sx={{
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack
            direction='row'
            spacing={1}
            justifyContent='flex-end'>
            <Button
              variant='outlined'
              onClick={handleRefresh}
              disabled={logsLoading}>
              Refresh
            </Button>
            <Button
              variant={isStreaming ? 'contained' : 'outlined'}
              color={isStreaming ? 'secondary' : 'primary'}
              onClick={toggleStreaming}
              disabled={!selectedNamespace || !selectedPod}>
              {isStreaming ? 'Stop' : 'Start'} Stream
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size='small'>
            <InputLabel>Log Lines</InputLabel>
            <Select
              value={logTail}
              onChange={handleLogTailChange}
              label='Log Lines'>
              {TAIL_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title='How often to check for new logs while streaming. Changes apply immediately.'>
            <FormControl fullWidth size='small'>
              <InputLabel>Stream Interval</InputLabel>
              <Select
                value={streamingInterval}
                onChange={handleStreamingIntervalChange}
                onOpen={() => {
                  dropdownInteractionRef.current = true;
                }}
                onClose={() => {
                  dropdownInteractionRef.current = false;
                  // Update logs after a brief delay to allow for final updates
                  setTimeout(() => {
                    if (logs && logs.length > 0) {
                      setAccumulatedLogs(logs);
                      setLastLogCount(logs.length);
                    }
                  }, 100);
                }}
                label='Stream Interval'>
                {Object.keys(STREAMING_INTERVALS).map((interval) => (
                  <MenuItem key={interval} value={interval}>
                    {interval}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={isStreaming}
                onChange={toggleStreaming}
                disabled={!selectedNamespace || !selectedPod}
              />
            }
            label='Auto-stream'
          />
        </Grid>

        {!selectedNamespace || !selectedPod ? (
          <Grid item xs={12}>
            <Alert severity='warning'>
              Please select a namespace and pod from the previous tabs
              to view logs.
            </Alert>
          </Grid>
        ) : null}
      </Grid>
    </Paper>
  );

  if (logsLoading && accumulatedLogs.length === 0) {
    return (
      <Box>
        <LogControls />
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='400px'>
          <Spinner />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <LogControls />

      <LogViewer
        logs={accumulatedLogs}
        isStreaming={isStreaming}
        onStreamToggle={toggleStreaming}
        onClear={handleClearLogs}
        title='Kubernetes Pod Logs'
        podName={selectedPod}
        namespace={selectedNamespace}
        loading={logsLoading}
      />

      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertSeverity}
          variant='filled'>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export { EnhancedKubernetesLogs };
