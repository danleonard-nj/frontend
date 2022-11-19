import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-twilight';
import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';

const KasaDeviceClientResponseDialog = () => {
  const dispatch = useDispatch();
  const [json, setJson] = useState('');
  const isVisible = useSelector(
    (x) => x.dialog[dialogType.kasaDeviceClientResponse]
  );

  const deviceClientResponse = useSelector(
    (x) => x.device.deviceClientResponse
  );

  const handleClose = () => {
    dispatch(closeDialog(dialogType.kasaDeviceClientResponse));
  };

  useEffect(() => {
    setJson(JSON.stringify(deviceClientResponse, null, '\t'));
  }, [deviceClientResponse]);

  return (
    <Dialog onClose={handleClose} open={isVisible} maxWidth='md' fullWidth>
      <DialogTitle>Client Response</DialogTitle>
      <DialogContent>
        <AceEditor
          placeholder='Placeholder Text'
          mode='json'
          theme='twilight'
          width='100%'
          height='50vh'
          setOptions={{ useWorker: false }}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={json ?? '{}'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export { KasaDeviceClientResponseDialog };
