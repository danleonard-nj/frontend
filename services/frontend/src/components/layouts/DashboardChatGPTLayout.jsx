import React, { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPrompt,
  setTokens,
} from '../../store/chatgpt/chatGptSlice';
import Spinner from '../Spinner';
import { getPrediction } from '../../store/chatgpt/chatGptActions';

const PageTitle = styled(Typography)({
  marginBottom: '1rem',
});

const DashboardChatGPTLayout = () => {
  const dispatch = useDispatch();

  const { prediction, predictionLoading } = useSelector(
    (x) => x.chatgpt
  );

  const handleTokenChangeCaptured = (event) => {
    console.log(event.target.value);
    dispatch(setTokens(event.target.value));
  };

  const handlePredictionChangeCaptured = (event) => {
    console.log(event.target.value);
    dispatch(setPrompt(event.target.value));
  };

  const handleSubmitPrediction = () => {
    dispatch(getPrediction());
  };

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={3} id='device-list-grid'>
        <Grid item lg={6}>
          <PageTitle variant='h5'>Completions</PageTitle>
        </Grid>

        <Grid item lg={6} align='right'>
          <TextField
            size='small'
            label='Tokens'
            placeholder='Tokens'
            defaultValue={2048}
            onChangeCapture={handleTokenChangeCaptured}
          />
        </Grid>
        <Grid item lg={6}>
          <TextField
            multiline
            label='Prompt'
            placeholder='Write a prompt...'
            fullWidth
            minRows={10}
            onChangeCapture={handlePredictionChangeCaptured}
          />
        </Grid>
        <Grid item lg={6}>
          {predictionLoading ? (
            <Spinner />
          ) : (
            <TextField
              multiline
              label='Completion'
              minRows={10}
              fullWidth
              value={prediction ?? ''}
            />
          )}
        </Grid>
        <Grid item lg={12}>
          <Button variant='outlined' onClick={handleSubmitPrediction}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardChatGPTLayout };
