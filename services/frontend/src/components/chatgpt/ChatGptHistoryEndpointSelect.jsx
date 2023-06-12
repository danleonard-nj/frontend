import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedHistoryEndpoint } from '../../store/chatgpt/chatGptSlice';

const ChatGptHistoryEndpointSelect = () => {
  const dispatch = useDispatch();

  const { historyEndpoints = [], selectedHistoryEndpoint = '' } =
    useSelector((x) => x.chatgpt);

  const handleHistoryEndpointChange = (event) => {
    dispatch(setSelectedHistoryEndpoint(event.target.value));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id='chat-gpt-history-endpoint-select-label'>
        Endpoint
      </InputLabel>
      <Select
        labelId='chat-gpt-history-endpoint-select-label'
        id='chat-gpt-request-type-select'
        value={selectedHistoryEndpoint ?? ''}
        align='left'
        label='Endpoint'
        onChange={handleHistoryEndpointChange}>
        {historyEndpoints.map((endpoint) => (
          <MenuItem value={endpoint}>{endpoint}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { ChatGptHistoryEndpointSelect };
