import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { imageSizes, requestType } from '../../api/data/chatGpt';
import {
  setImageRepetitions,
  setImageSize,
  setTokens,
} from '../../store/chatgpt/chatGptSlice';
import { ChatGptEngineSelect } from './ChatGptEngineSelect';
import { ChatGptRequestTypeSelect } from './ChatGptRequestTypeSelect';

const ChatGptImageSizeSelect = () => {
  const dispatch = useDispatch();

  const { imageSize = '' } = useSelector((x) => x.chatgpt);

  const handleImageSizeChange = (event) => {
    dispatch(setImageSize(event.target.value));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id='chat-gpt-image-size-select-label'>
        Size
      </InputLabel>
      <Select
        labelId='chat-gpt-image-size-select-label'
        id='chat-gpt-image-size-select'
        value={imageSize}
        align='left'
        label='Size'
        onChange={handleImageSizeChange}>
        {imageSizes.map((size) => (
          <MenuItem value={size}>{size}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const ChatGptConfigurationContent = () => {
  const dispatch = useDispatch();

  const { tokens = 2000, selectedRequestType = '' } = useSelector(
    (x) => x.chatgpt
  );

  const handleTokenChangeCaptured = (event) => {
    dispatch(setTokens(event.target.value));
  };

  const handleImageRepetitionChangeCaptured = (event) => {
    dispatch(setImageRepetitions(event.target.value));
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} xs={12}>
        <ChatGptRequestTypeSelect />
      </Grid>

      {[requestType.completion, requestType.chat].includes(
        selectedRequestType
      ) && (
        <Grid item lg={12} xs={12}>
          <ChatGptEngineSelect />
        </Grid>
      )}

      {selectedRequestType === requestType.completion && (
        <Grid item lg={12} xs={12}>
          <TextField
            size='small'
            label='Tokens'
            placeholder='Tokens'
            value={tokens ?? ''}
            fullWidth
            defaultValue={2048}
            onChangeCapture={handleTokenChangeCaptured}
          />
        </Grid>
      )}

      {selectedRequestType === requestType.image && (
        <Grid item lg={12} xs={12}>
          <TextField
            size='small'
            label='Repetitions'
            placeholder='Repetitions'
            fullWidth
            defaultValue={2}
            onChangeCapture={handleImageRepetitionChangeCaptured}
          />
        </Grid>
      )}
      {selectedRequestType === requestType.image && (
        <Grid item lg={12} xs={12}>
          <ChatGptImageSizeSelect />
        </Grid>
      )}
    </Grid>
  );
};

export { ChatGptConfigurationContent };
