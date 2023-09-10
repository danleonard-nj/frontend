import { Button, FormGroup, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogs } from "../../store/kubeLogs/kubeLogActions";
import Spinner from "../Spinner";
import { setLogTail } from "../../store/kubeLogs/kubeLogSlice";

const filterPodLogs = (logs, filterValue, setLogs) => {
  return filterValue ? setLogs(logs.filter((x) => x.includes(filterValue))) : setLogs(logs);
};

const KubernetesLogs = () => {
  const dispatch = useDispatch();

  const { logs, logsLoading, logTail, selectedPod, selectedNamespace } = useSelector(
    (x) => x.kubeLogs
  );

  const [podLogs, setPodLogs] = useState([]);
  const [logLines, setLogLines] = useState(logTail ?? 0);
  const [filterValue, setFilterValue] = useState("");

  const handleRefresh = () => {
    dispatch(getLogs(selectedNamespace, selectedPod));
  };

  const handleLogLineValueChange = (event) => {
    setLogLines(event.target.value);
    dispatch(setLogTail(event.target.value));
  };

  useEffect(() => {
    dispatch(getLogs(selectedNamespace, selectedPod));
  }, [logTail]);

  useEffect(() => {
    filterPodLogs(logs, filterValue, setPodLogs);
  }, [logs, filterValue]);

  const LogContainer = () =>
    logsLoading ? (
      <Spinner />
    ) : (
      <TextField
        placeholder=''
        multiline
        rows={30}
        maxRows={30}
        value={podLogs?.join("\n") ?? ""}
        fullWidth
        contentEditable={false}
        spellCheck={false}
        InputProps={{
          readonly: true,
        }}
      />
    );

  return (
    <Grid container spacing={3} sx={{ marginTop: 3 }}>
      <Grid item lg={6}>
        <Typography id='input-label' gutterBottom>
          Logs
        </Typography>
        <TextField
          type='number'
          value={logLines}
          size='small'
          aria-labelledby='input-label'
          onChange={handleLogLineValueChange}
        />
        <Button variant='outlined' onClick={handleRefresh}>
          Refresh
        </Button>
        <Grid item lg={3}>
          <FormGroup></FormGroup>
        </Grid>
      </Grid>
      <Grid item lg={12} xs={12} sm={12} md={12}>
        <TextField
          fullWidth
          label='Search'
          onChange={(e) => setFilterValue(e.target.value)}
          value={filterValue}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12} md={12}>
        <LogContainer />
      </Grid>
    </Grid>
  );
};

export { KubernetesLogs };
