import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestType } from '../../api/data/chatGpt';
import { getUsage } from '../../store/chatgpt/chatGptActions';
import { ChatGptImageList } from './ChatGptImageList';

const ChatGptResult = () => {
  const dispatch = useDispatch();
  const {
    selectedRequestType = '',
    prediction = '',
    images = [],
  } = useSelector((x) => x.chatgpt);

  useEffect(() => {
    dispatch(getUsage());
  }, []);

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
