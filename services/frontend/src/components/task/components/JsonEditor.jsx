import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-twilight';
import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../../store/alert/alertSlice';
import { updateTaskState } from '../../../store/task/taskActions';
import DashboardTitle from '../../dashboard/DashboardTitle';

export default function JsonEditor() {
  const dispatch = useDispatch();
  const task = useSelector((store) => store.task.task) ?? {};

  const [json, setJson] = useState('');

  useEffect(() => {
    if (task) {
      setJson(JSON.stringify(task?.payload, null, '\t'));
    }
  }, [task]);

  const handleChange = (value) => {
    setJson(value);
  };

  const handleParse = () => {
    try {
      const parsedJson = JSON.parse(json);
      dispatch(
        updateTaskState((task) => ({
          ...task,
          json: parsedJson,
        }))
      );

      dispatch(
        setAlert({
          isOpen: true,
          message: 'Valid JSON',
          severity: 'info',
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const JsonEditor = () => {
    return (
      <>
        <Grid container spacing={3} sx={{ marginBottom: 2 }}>
          <Grid item lg={10}>
            <DashboardTitle>Request Body</DashboardTitle>
          </Grid>
          <Grid item lg={2} align='right'>
            <Button onClick={handleParse}>Parse</Button>
          </Grid>
        </Grid>
        <span style={{ display: 'flex' }}>
          <AceEditor
            placeholder='Placeholder Text'
            mode='json'
            theme='twilight'
            width='100%'
            height='250px'
            setOptions={{ useWorker: false }}
            onChange={handleChange}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={json ?? '{}'}
          />
        </span>
      </>
    );
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'>
          <Typography>JSON</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <JsonEditor />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
