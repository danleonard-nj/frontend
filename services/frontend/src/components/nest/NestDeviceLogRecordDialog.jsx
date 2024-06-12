import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDialog,
  dialogType,
} from '../../store/dialog/dialogSlice';
import { GenericJsonEditor } from '../GenericJsonEditor';

const NestDeviceLogRecordDialog = () => {
  const dispatch = useDispatch();

  const isVisible = useSelector(
    (x) => x.dialog[dialogType.viewNestDeviceLogRecord]
  );

  const selectedDeviceLogId = useSelector(
    (x) => x.nest.selectedDeviceLogId
  );

  const sensorHistory = useSelector((x) => x.nest.sensorHistory);
  const [deviceLog, setDeviceLog] = React.useState({});

  const handleClose = () => {
    dispatch(closeDialog(dialogType.viewNestDeviceLogRecord));
  };

  useEffect(() => {
    const record = sensorHistory.find(
      (x) => x.id === selectedDeviceLogId
    );
    setDeviceLog(record);
  }, [selectedDeviceLogId]);

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>Device Record</DialogTitle>
      <DialogContent>
        <GenericJsonEditor
          value={JSON.stringify(deviceLog, null, '\t')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { NestDeviceLogRecordDialog };
