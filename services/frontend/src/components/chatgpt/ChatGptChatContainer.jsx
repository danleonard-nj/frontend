import {
  ButtonGroup,
  Chip,
  Grid,
  IconButton,
  TextField,
  styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setChatMessages,
  setHistoryChatIndex,
  setHistoryRecordMessages,
  setIsHistoryViewEnabled,
  setMessage,
} from '../../store/chatgpt/chatGptSlice';
import Spinner from '../Spinner';
import { ChatGptStyledPaper } from './ChatGptStyledPaper';
import AlarmIcon from '@mui/icons-material/Alarm';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ClearIcon from '@mui/icons-material/Clear';

const getChatMessageColor = (role) => {
  return role === 'user' ? 'primary' : 'info';
};

const ChatMessageChip = styled(Chip)(({ theme }) => ({
  padding: theme.spacing(1),
  height: '100%',
  '& .MuiChip-label': {
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    textOverflow: 'clip',
  },
}));

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

  // const [historyChatIndex, setHistoryChatIndex] = useState(
  //   history?.length
  // );
  // const [historyRecordMessages, setHistoryRecordMessages] = useState(
  //   []
  // );
  // const [isHistoryViewEnabled, setIsHistoryViewEnabled] =
  //   useState(false);

  const dispatch = useDispatch();
  console.log(historyChatIndex);

  const handleUpdateOutgoingMessage = (event) => {
    dispatch(setMessage(event.target.value));
  };

  const handleLeftHistoryArrowOnClick = () => {
    if (historyChatIndex === 0) {
      console.log('at zero');
      return;
    }

    !isHistoryViewEnabled && dispatch(setIsHistoryViewEnabled(true));

    const currentIndex = historyChatIndex - 1;
    const historyRecord = history[currentIndex];

    dispatch(setHistoryChatIndex(currentIndex));

    dispatch(
      setHistoryRecordMessages([
        ...historyRecord?.response?.request?.body?.messages,
        historyRecord?.response?.response?.body?.choices[0]?.message,
      ])
    );

    console.log(historyRecordMessages);
  };

  const handleRightHistoryArrowOnClick = () => {
    if (historyChatIndex === history?.length) {
      console.log('maxed out');
      return;
    }

    !isHistoryViewEnabled && dispatch(setIsHistoryViewEnabled(true));

    const currentIndex = historyChatIndex + 1;
    const historyRecord = history[currentIndex];

    dispatch(setHistoryChatIndex(currentIndex));
    dispatch(
      setHistoryRecordMessages([
        ...historyRecord?.response?.request?.body?.messages,
        historyRecord?.response?.response?.body?.choices[0]?.message,
      ])
    );

    console.log(historyRecordMessages);
  };

  const handleRightDoubleArrowOnClick = () => {
    !isHistoryViewEnabled && dispatch(setIsHistoryViewEnabled(true));

    const historyRecord = history[history.length - 1];

    dispatch(setHistoryChatIndex(history.length));
    dispatch(
      setHistoryRecordMessages([
        ...historyRecord?.response?.request?.body?.messages,
        historyRecord?.response?.response?.body?.choices[0]?.message,
      ])
    );
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
            disabled={historyChatIndex === history?.length}
            onClick={handleRightHistoryArrowOnClick}>
            <KeyboardArrowRightIcon />
          </IconButton>
          <IconButton
            disabled={historyChatIndex === history?.length}
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
