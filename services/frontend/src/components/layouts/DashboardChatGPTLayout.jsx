import { Button, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestType } from '../../api/data/chatGpt';
import {
  getChat,
  getEngines,
  getImages,
  getPrediction,
} from '../../store/chatgpt/chatGptActions';
import {
  setChatMessages,
  setConfigurationExpanded,
  setPrompt,
} from '../../store/chatgpt/chatGptSlice';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import Spinner from '../Spinner';
import { ChatGptChatContainer } from '../chatgpt/ChatGptChatContainer';
import { ChatGptConfigurationAccordion } from '../chatgpt/ChatGptConfigurationAccordion';
import { ChatGptPageTitle } from '../chatgpt/ChatGptPageTitle';
import { ChatGptResult } from '../chatgpt/ChatGptResult';
import { ChatGptStyledPaper } from '../chatgpt/ChatGptStyledPaper';

const DashboardChatGPTLayout = () => {
  const dispatch = useDispatch();

  const [outgoingMessage, setOutgoingMessage] = useState('');

  const {
    predictionLoading = false,
    selectedRequestType = '',
    isConfigurationExpanded = true,
  } = useSelector((x) => x.chatgpt) ?? {};

  const handlePredictionChangeCaptured = (event) => {
    dispatch(setPrompt(event.target.value));
  };

  const handleKeyPress = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      outgoingMessage.trim() != ''
    ) {
      handleSubmitPrediction();
    }
  };

  const handleSubmitPrediction = () => {
    selectedRequestType === requestType.image &&
      dispatch(getImages());

    selectedRequestType === requestType.completion &&
      dispatch(getPrediction());

    if (selectedRequestType === requestType.chat) {
      dispatch(getChat());
      setOutgoingMessage('');
    }
  };

  const handleConfigurationExpand = () => {
    dispatch(setConfigurationExpanded(!isConfigurationExpanded));
  };

  const handleOpenHistoryDialog = () => {
    dispatch(openDialog(dialogType.chatGptViewHistoryDialog));
  };

  const handleClearChatOnClick = () => {
    dispatch(setChatMessages([]));
  };

  useEffect(() => {
    dispatch(getEngines());
  }, []);

  return (
    <ChatGptStyledPaper el={2}>
      <Grid container spacing={3} id='device-list-grid'>
        <Grid item lg={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={12}>
              <ChatGptPageTitle variant='h5'>
                {selectedRequestType}
              </ChatGptPageTitle>
            </Grid>
            <Grid item lg={12} xs={12}>
              {selectedRequestType === requestType.chat ? (
                <ChatGptChatContainer
                  outgoingMessage={outgoingMessage}
                  setOutgoingMessage={setOutgoingMessage}
                  onKeyPress={handleKeyPress}
                />
              ) : (
                <TextField
                  multiline
                  label='prompt'
                  placeholder='Write a prompt...'
                  fullWidth
                  minRows={10}
                  onChangeCapture={handlePredictionChangeCaptured}
                />
              )}
            </Grid>
            <Grid item lg={12} xs={12}>
              <Button
                variant='outlined'
                onClick={handleSubmitPrediction}
                disabled={predictionLoading}>
                Send
              </Button>
              <Button
                variant='outlined'
                onClick={handleOpenHistoryDialog}
                sx={{ marginLeft: '1rem' }}>
                History
              </Button>
              {selectedRequestType === requestType.chat && (
                <Button
                  variant='outlined'
                  onClick={handleClearChatOnClick}
                  sx={{ marginLeft: '1rem' }}>
                  Clear
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={12}>
              <ChatGptConfigurationAccordion
                isExpanded={isConfigurationExpanded}
                expand={handleConfigurationExpand}
              />
            </Grid>
            <Grid item lg={12} xs={12}>
              {predictionLoading ? <Spinner /> : <ChatGptResult />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ChatGptStyledPaper>
  );
};

export { DashboardChatGPTLayout };
