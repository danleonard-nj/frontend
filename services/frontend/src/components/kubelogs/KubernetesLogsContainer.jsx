import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogs } from '../../store/kubeLogs/kubeLogActions';
import { setLogTail } from '../../store/kubeLogs/kubeLogSlice';

const KubernetesLogs = () => {
  const dispatch = useDispatch();
  const logs = useSelector((x) => x.kubeLogs.logs);
  const logTail = useSelector((x) => x.kubeLogs.logTail);
  const selectedPod = useSelector((x) => x.kubeLogs.selectedPod);
  const selectedNamespace = useSelector((x) => x.kubeLogs.selectedNamespace);

  const [slider, setSlider] = useState(logTail ?? 0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState({});

  const handleSliderChangeCommited = (value) => {
    dispatch(setLogTail(value));
  };

  const handleSliderChange = (value) => {
    setSlider(value);
  };

  const handleRefresh = () => {
    dispatch(getLogs(selectedNamespace, selectedPod));
  };

  const handleSetAutoRefresh = (value) => {
    if (!value && autoRefresh) {
      clearInterval(refreshInterval);
      setAutoRefresh(false);
    }
    if (value && !autoRefresh) {
      const interval = setInterval(handleRefresh, 1000);
      setAutoRefresh(true);
      setRefreshInterval(interval);
    }
  };

  useEffect(() => {
    dispatch(getLogs(selectedNamespace, selectedPod));
  }, [logTail]);

  return (
    <Grid container spacing={3} sx={{ marginTop: 3 }}>
      <Grid item lg={12} xs={12} sm={12} md={12}>
        <Grid container spacing={3}>
          <Grid item lg={1} xs={12} sm={6}>
            <Typography>Lines</Typography>
          </Grid>
          <Grid item lg={3} xs={12} sm={6}>
            <Slider
              aria-label='Miles'
              value={slider}
              valueLabelDisplay='auto'
              onChangeCommitted={(event, value) =>
                handleSliderChangeCommited(value)
              }
              onChange={(event, value) => handleSliderChange(value)}
              step={250}
              marks
              min={250}
              max={5000}
            />
          </Grid>
          <Grid item lg={3} xs={6} sm={6}>
            <Button
              variant='filled'
              sx={{ margin: 'auto' }}
              onClick={handleRefresh}>
              Refresh
            </Button>
          </Grid>
          <Grid item lg={3}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value={autoRefresh}
                    onChange={(event) =>
                      handleSetAutoRefresh(event.target.checked)
                    }
                  />
                }
                label='Auto-Refresh'
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={12} xs={12} sm={12} md={12}>
        <TextField
          placeholder=''
          multiline
          rows={30}
          maxRows={30}
          value={logs?.join('\n') ?? ''}
          fullWidth
          contentEditable={false}
          spellCheck={false}
        />
      </Grid>
    </Grid>
  );
};

export { KubernetesLogs };
