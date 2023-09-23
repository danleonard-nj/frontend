import { TextField } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { requestType } from '../../api/data/chatGpt';
import { ChatGptImageList } from './ChatGptImageList';

const ChatGptResult = () => {
  const {
    selectedRequestType = '',
    prediction = '',
    images = [],
  } = useSelector((x) => x.chatgpt);

  return (
    <>
      {selectedRequestType === requestType.completion &&
        prediction && (
          <TextField
            multiline
            label={selectedRequestType}
            minRows={10}
            fullWidth
            value={prediction ?? ''}
          />
        )}
      {selectedRequestType === requestType.image &&
        images.length > 0 && <ChatGptImageList />}
    </>
  );
};

export { ChatGptResult };
