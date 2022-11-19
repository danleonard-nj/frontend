import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, dialogType } from '../../../store/dialog/dialogSlice';
import {
  addLink,
  getLinkOptions,
} from '../../../store/schedule/scheduleActions';

export default function ScheduleAddLinkDialog() {
  const dispatch = useDispatch();
  const linkOptions = useSelector((x) => x.schedule.linkOptions);
  const isVisible = useSelector((x) => x.dialog[dialogType.addLink]);
  const schedule = useSelector((x) => x.schedule.schedule);

  const [selected, setSelected] = useState('');

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const handleClose = () => {
    dispatch(closeDialog(dialogType.addLink));
  };

  const handleAddLink = () => {
    dispatch(addLink(selected));
    handleClose();
  };

  useEffect(() => {
    dispatch(getLinkOptions());
  }, [schedule.scheduleId]);

  return (
    <Dialog onClose={handleClose} open={isVisible} maxWidth='sm' fullWidth>
      <DialogTitle>Add Link</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 1 }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Task</InputLabel>
            <Select
              variant='standard'
              labelId='demo-simple-select-label'
              value={selected ?? ''}
              onChange={handleChange}>
              {linkOptions?.map((option, index) => (
                <MenuItem
                  key={index}
                  id={`schedule-add-link-select-task-${index}`}
                  value={option.taskId}>
                  {option.taskName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddLink}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
