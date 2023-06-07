import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedEngine } from '../../store/chatgpt/chatGptSlice';
import Spinner from '../Spinner';

const ChatGptEngineSelect = () => {
  const dispatch = useDispatch();

  const {
    engines = [],
    enginesLoading = false,
    selectedEngine = '',
  } = useSelector((x) => x.chatgpt);

  const handleEngineChangeCaptured = (event) => {
    dispatch(setSelectedEngine(event.target.value));
  };

  return enginesLoading ? (
    <Spinner />
  ) : (
    <FormControl fullWidth>
      <InputLabel id='chat-gpt-engine-select-label'>
        Engine
      </InputLabel>
      <Select
        labelId='chat-gpt-engine-select-label'
        id='chat-gpt-engine-select'
        value={selectedEngine}
        align='left'
        label='Engine'
        onChange={handleEngineChangeCaptured}>
        {engines.map((e) => (
          <MenuItem value={e.id}>{e.id}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { ChatGptEngineSelect };
