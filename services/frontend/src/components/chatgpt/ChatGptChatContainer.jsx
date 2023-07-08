import { Chip, Grid, TextField, styled } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../store/chatgpt/chatGptSlice';
import Spinner from '../Spinner';
import { ChatGptStyledPaper } from './ChatGptStyledPaper';

const CustomChip = styled(Chip)(({ theme }) => ({
  padding: theme.spacing(1),
  height: '100%',
  '& .MuiChip-label': {
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    textOverflow: 'clip',
  },
}));

const ChatGptChatContainer = ({
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
    <ChatGptStyledPaper el={3}>
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
    </ChatGptStyledPaper>
  );
};

export { ChatGptChatContainer };
