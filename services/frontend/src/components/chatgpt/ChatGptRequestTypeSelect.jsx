import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestType } from '../../api/data/chatGpt';
import { setSelectedRequestType } from '../../store/chatgpt/chatGptSlice';

const ChatGptRequestTypeSelect = () => {
  const dispatch = useDispatch();

  const { selectedRequestType = '' } = useSelector((x) => x.chatgpt);

  const handleRequestTypeChange = (event) => {
    dispatch(setSelectedRequestType(event.target.value));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id='chat-gpt-request-type-select-label'>
        Request Type
      </InputLabel>
      <Select
        labelId='chat-gpt-request-type-select-label'
        id='chat-gpt-request-type-select'
        value={selectedRequestType}
        align='left'
        label='Request Type'
        onChange={handleRequestTypeChange}>
        {Object.keys(requestType).map((rt) => (
          <MenuItem value={rt}>{rt}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { ChatGptRequestTypeSelect };
