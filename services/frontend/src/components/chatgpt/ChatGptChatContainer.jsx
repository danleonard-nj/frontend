import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {
  ButtonGroup,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessageColor } from '../../api/helpers/chatGptHelpers';
import {
  getHistory,
  leftHistoryArrowClick,
  rightHistoryArrowClick,
  rightHistoryDoubleArrowClick,
} from '../../store/chatgpt/chatGptActions';
import {
  setHistoryChatIndex,
  setIsHistoryViewEnabled,
  setMessage,
} from '../../store/chatgpt/chatGptSlice';
import Spinner from '../Spinner';
import { ChatMessageChip } from './ChatGptChatMessageChip';
import { ChatGptStyledPaper } from './ChatGptStyledPaper';

const ChipMessage = ({ content }) => {
  return <span style={{ whiteSpace: 'pre-line' }}>{content}</span>;
};

const ChatGptChatContainer = ({
  outgoingMessage,
  setOutgoingMessage,
  onKeyPress,
}) => {
  const {
    chatMessages = [],
    chatMessagesLoading,
    history,
    historyChatIndex,
    historyRecordMessages,
    isHistoryViewEnabled,
  } = useSelector((x) => x.chatgpt);

  const dispatch = useDispatch();
  console.log(historyChatIndex);

  const handleUpdateOutgoingMessage = (event) => {
    dispatch(setMessage(event.target.value));
  };

  const handleLeftHistoryArrowOnClick = () => {
    dispatch(leftHistoryArrowClick());
  };

  const handleRightHistoryArrowOnClick = () => {
    dispatch(rightHistoryArrowClick());
  };

  const handleRightDoubleArrowOnClick = () => {
    dispatch(rightHistoryDoubleArrowClick());
  };

  const handleClearOnClick = () => {
    dispatch(setHistoryChatIndex(history?.length));
    dispatch(setIsHistoryViewEnabled(false));
  };

  const getMessages = () =>
    isHistoryViewEnabled ? historyRecordMessages : chatMessages;

  useEffect(() => {
    if (historyChatIndex === 0) {
      dispatch(setHistoryChatIndex(history?.length));
    }
  }, [history]);

  useEffect(() => {
    if (history?.length === 0) {
      dispatch(getHistory(1));
    }
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} align='right'>
        <ButtonGroup>
          <IconButton>
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
          <IconButton
            disabled={history?.length === 0}
            onClick={handleLeftHistoryArrowOnClick}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton
            disabled={historyChatIndex === history?.length - 1}
            onClick={handleRightHistoryArrowOnClick}>
            <KeyboardArrowRightIcon />
          </IconButton>
          <IconButton
            disabled={historyChatIndex === history?.length - 1}
            onClick={handleRightDoubleArrowOnClick}>
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
          <IconButton onClick={handleClearOnClick}>
            <ClearIcon />
          </IconButton>
        </ButtonGroup>
      </Grid>
      <Grid item lg={12}>
        <ChatGptStyledPaper el={3}>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={12}>
              <Grid container spacing={3}>
                {getMessages().map((message) => (
                  <Grid item lg={12}>
                    <ChatMessageChip
                      component='div'
                      label={
                        <ChipMessage content={message?.content} />
                      }
                      color={getChatMessageColor(
                        message?.role ?? 'user'
                      )}
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
        </ChatGptStyledPaper>
      </Grid>
    </Grid>
  );
};

export { ChatGptChatContainer };
