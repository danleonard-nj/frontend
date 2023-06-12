import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';

import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHistory } from '../../../store/chatgpt/chatGptActions';
import {
  setHistoryDaysBack,
  setSelectedHistoryEndpoint,
} from '../../../store/chatgpt/chatGptSlice';
import {
  closeDialog,
  dialogType,
} from '../../../store/dialog/dialogSlice';
import { ChatGptHistoryDaysBackSlider } from '../ChatGptHistoryDaysBackSlider';
import { ChatGptHistoryEndpointSelect } from '../ChatGptHistoryEndpointSelect';
import { ChatGptAccordianHistoryTable } from '../ChatGptAccordionHistoryTable';
import { chatGptEndpoints } from '../../../api/data/chatGpt';

const ChatGptHistoryViewDialog = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (x) => x.dialog[dialogType.chatGptViewHistoryDialog]
  );

  const {
    historyDaysBack = 7,
    selectedHistoryEndpoint = '',
    history = [],
    historyEndpoints = [],
    historyEndpointsLoading = true,
  } = useSelector((x) => x.chatgpt);

  const handleLoadHistoryData = () => {
    dispatch(getHistory(historyDaysBack, selectedHistoryEndpoint));
  };

  const handleClose = () => {
    dispatch(closeDialog(dialogType.chatGptViewHistoryDialog));
  };

  const handleSetHistoryDaysBack = (value) => {
    dispatch(setHistoryDaysBack(value));
  };

  const handleClearSelectedEndpoint = () => {
    dispatch(setSelectedHistoryEndpoint(''));
  };

  useEffect(() => {
    console.log('changed', historyDaysBack, selectedHistoryEndpoint);
    if (!history?.length) {
      dispatch(getHistory(historyDaysBack));
    }
  }, [historyDaysBack, selectedHistoryEndpoint]);

  console.log('history', history);

  const handleAccordionExpand = (endpoint) => {
    dispatch(
      setSelectedHistoryEndpoint(
        endpoint == selectedHistoryEndpoint ? '' : endpoint
      )
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth>
      <DialogContent sx={{ padding: 2 }}>
        <Grid container>
          <Grid item lg={12}>
            <DialogTitle>ChatGPT History</DialogTitle>
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={12}>
              <>
                {Object.values(chatGptEndpoints).map(
                  (historyEndpoint) => (
                    <ChatGptAccordianHistoryTable
                      expanded={
                        historyEndpoint === selectedHistoryEndpoint
                      }
                      setExpanded={() =>
                        handleAccordionExpand(historyEndpoint)
                      }
                      endpoint={historyEndpoint}
                      history={history.filter(
                        (x) => x.endpoint === historyEndpoint
                      )}
                    />
                  )
                )}
              </>
            </Grid>
            <Grid item lg={6}>
              <Box
                sx={{ display: 'inline-block', width: '100%', p: 2 }}>
                <Typography id='input-slider' gutterBottom>
                  Days Back
                </Typography>
                {/* <ChatGptHistoryEndpointSelect />
                <Button onClick={handleClearSelectedEndpoint}>
                  Clear
                </Button> */}
                <ChatGptHistoryDaysBackSlider
                  onChangeCommitted={handleSetHistoryDaysBack}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export { ChatGptHistoryViewDialog };
