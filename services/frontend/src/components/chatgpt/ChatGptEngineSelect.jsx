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

  const handleEngineOnChange = (event) => {
    console.log(event.target.value);
    dispatch(setSelectedEngine(event.target.value));
  };

  return enginesLoading ? (
    <Spinner />
  ) : (
    <FormControl fullWidth>
      <InputLabel id='cgpt-engine-select-label'>Engine</InputLabel>
      <Select
        labelId='cgpt-engine-select-label'
        id='cgpt-engine-select'
        value={selectedEngine}
        align='left'
        label='Engine'
        onChange={handleEngineOnChange}>
        {engines.map((e) => (
          <MenuItem value={e.id}>{e.id}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { ChatGptEngineSelect };
