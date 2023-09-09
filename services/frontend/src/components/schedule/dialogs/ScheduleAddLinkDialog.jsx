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
import {
  closeDialog,
  dialogType,
} from '../../../store/dialog/dialogSlice';
import { addLink } from '../../../store/schedule/scheduleActions';
import { getTasks } from '../../../store/task/taskActions';

const getAvailableLinkOptions = (tasks, links) =>
  tasks.filter((x) => !links.includes(x.taskId));

export default function ScheduleAddLinkDialog() {
  const [selectedLink, setSelectedLink] = useState('');
  const [linkOptions, setLinkOptions] = useState([]);

  const dispatch = useDispatch();

  const {
    task: { tasks = [] },
    schedule: { schedule },
  } = useSelector((x) => x);

  const isVisible = useSelector((x) => x.dialog[dialogType.addLink]);

  const handleChangeEvent = (event) => {
    setSelectedLink(event.target.value);
  };

  const handleCloseDialogOnClick = () => {
    dispatch(closeDialog(dialogType.addLink));
  };

  const handleAddLinkOnClick = () => {
    dispatch(addLink(selectedLink));
    handleCloseDialogOnClick();
  };

  // Refresh the tasks for the link options
  useEffect(() => {
    dispatch(getTasks());
  }, []);

  // Set the available link options
  useEffect(() => {
    setLinkOptions(
      getAvailableLinkOptions(tasks, schedule.links ?? [])
    );
  }, [schedule.scheduleId]);

  return (
    <Dialog
      onClose={handleCloseDialogOnClick}
      open={isVisible}
      maxWidth='sm'
      fullWidth>
      <DialogTitle>Add Link</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 1 }}>
          <FormControl fullWidth>
            <InputLabel id='task-input-label'>Task</InputLabel>
            <Select
              variant='standard'
              labelId='task-input-label'
              value={selectedLink ?? ''}
              onChange={handleChangeEvent}>
              {linkOptions?.map((option, index) => (
                <MenuItem key={index} value={option.taskId}>
                  {option.taskName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialogOnClick}>Cancel</Button>
        <Button onClick={handleAddLinkOnClick}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
