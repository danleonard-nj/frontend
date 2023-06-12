import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestType } from '../../api/data/chatGpt';
import {
  getEngines,
  getImages,
  getPrediction,
} from '../../store/chatgpt/chatGptActions';
import {
  setConfigurationExpanded,
  setPrompt,
} from '../../store/chatgpt/chatGptSlice';
import Spinner from '../Spinner';
import { ChatGptConfigurationContent } from '../chatgpt/ChatGptConfigurationContent';
import { ChatGptPageTitle } from '../chatgpt/ChatGptPageTitle';
import { ChatGptResult } from '../chatgpt/ChatGptResult';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';

const DashboardChatGPTLayout = () => {
  const dispatch = useDispatch();

  const {
    predictionLoading = false,
    selectedRequestType = '',
    isConfigurationExpanded = true,
  } = useSelector((x) => x.chatgpt) ?? {};

  const handlePredictionChangeCaptured = (event) => {
    dispatch(setPrompt(event.target.value));
  };

  const handleSubmitPrediction = () => {
    if (selectedRequestType === requestType.completion) {
      console.log('Submitting completion request');
      dispatch(getPrediction());
    }

    if (selectedRequestType === requestType.image) {
      console.log('Submittin image request');
      dispatch(getImages());
    }
  };

  const handleConfigurationExpand = () => {
    dispatch(setConfigurationExpanded(!isConfigurationExpanded));
  };

  const handleOpenHistoryDialog = () => {
    dispatch(openDialog(dialogType.chatGptViewHistoryDialog));
  };

  useEffect(() => {
    dispatch(getEngines());
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={3} id='device-list-grid'>
        <Grid item lg={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={12}>
              <ChatGptPageTitle variant='h5'>
                {selectedRequestType}
              </ChatGptPageTitle>
            </Grid>
            <Grid item lg={12} xs={12}>
              <TextField
                multiline
                label='prompt'
                placeholder='Write a prompt...'
                fullWidth
                minRows={10}
                onChangeCapture={handlePredictionChangeCaptured}
              />
            </Grid>
            <Grid item lg={12} xs={12}>
              <Button
                variant='outlined'
                onClick={handleSubmitPrediction}>
                Send
              </Button>
              <Button
                variant='outlined'
                onClick={handleOpenHistoryDialog}
                sx={{ marginLeft: '1rem' }}>
                History
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={12}>
              <Accordion
                elevation={3}
                expanded={isConfigurationExpanded}
                onChange={handleConfigurationExpand}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'>
                  <Typography>Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ChatGptConfigurationContent />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item lg={12} xs={12}>
              {predictionLoading ? <Spinner /> : <ChatGptResult />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardChatGPTLayout };
