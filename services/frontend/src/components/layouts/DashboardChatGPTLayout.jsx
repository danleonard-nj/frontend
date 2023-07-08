import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
  styled,
} from '@mui/material';
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
  setConfigurationExpanded,
  setMessage,
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

const CustomChip = styled(Chip)(({ theme }) => ({
  padding: theme.spacing(1),
  height: '100%',
  '& .MuiChip-label': {
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    textOverflow: 'clip',
  },
}));

const StyledPaper = ({ el, children }) => {
  return (
    <Paper
      elevation={el}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Paper>
  );
};

const ChatContainer = ({
  outgoingMessage,
  setOutgoingMessage,
  onKeyPress,
}) => {
  const { chatMessages = [], chatMessagesLoading } = useSelector(
    (x) => x.chatgpt
  );

  const dispatch = useDispatch();

  const handleUpdateOutgoingMessage = (event) => {
    dispatch(setMessage(event.target.value));
  };

  return (
    <StyledPaper el={3}>
      <Grid container spacing={3}>
        <Grid item lg={12} xs={12}>
          <Grid container spacing={3}>
            {chatMessages.map((message) => (
              <Grid item lg={12}>
                <CustomChip
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  component='div'
                  label={<section>{message?.content}</section>}
                  color={
                    message?.role === 'user' ? 'primary' : 'info'
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item lg={12} xs={12}>
          {chatMessagesLoading ? (
            <Grid container justifyContent='flex-end'>
              <Spinner size={30} />
            </Grid>
          ) : (
            <TextField
              size='small'
              label='message'
              defaultValue='Write a chat message...'
              fullWidth
              value={outgoingMessage ?? ''}
              onKeyPress={onKeyPress}
              onChangeCapture={handleUpdateOutgoingMessage}
              onChange={(e) => setOutgoingMessage(e.target.value)}
            />
          )}
        </Grid>
      </Grid>
    </StyledPaper>
  );
};
const ConfigurationAccordion = ({ isExpanded, expand }) => {
  return (
    <Accordion elevation={3} expanded={isExpanded} onChange={expand}>
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
  );
};
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
    if (event.key === 'Enter') {
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

  useEffect(() => {
    dispatch(getEngines());
  }, []);

  return (
    <StyledPaper el={2}>
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
                <ChatContainer
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
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={12}>
              <ConfigurationAccordion
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
    </StyledPaper>
  );
};

export { DashboardChatGPTLayout };
