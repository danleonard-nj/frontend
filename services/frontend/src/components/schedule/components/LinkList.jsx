import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../../store/dialog/dialogSlice';
import { removeSelectedScheduleLink } from '../../../store/schedule/scheduleActions';
import Spinner from '../../Spinner';
import DashboardTitle from '../../dashboard/DashboardTitle';

const handleGetScheduleWithLinks = (schedule, tasks) => {
  const links = tasks.filter((x) =>
    (schedule.links ?? []).includes(x.taskId)
  );
  return { ...schedule, links: links };
};

// Background for schedule list items
const ScheduleLinkListPaper = ({ children }) => (
  <Paper
    id='schedule-link-list-paper'
    elevation={1}
    sx={{ minHeight: '2rem' }}>
    {children}
  </Paper>
);

const ScheduleLinkBoxHeader = ({ onAddScheduleClick }) => (
  <Box sx={{ marginBottom: 1 }}>
    <Grid container>
      <Grid item lg={10} xs={6}>
        <DashboardTitle>Links</DashboardTitle>
      </Grid>
      <Grid item lg={2} xs={6} align='right'>
        <Button variant='text' onClick={onAddScheduleClick}>
          Link
        </Button>
      </Grid>
    </Grid>
  </Box>
);

const ScheduleLinkListItem = ({
  task,
  index,
  handleDeleteOnClick,
}) => (
  <ListItem
    disablePadding
    key={index}
    id={`schedule-list-item-${index}`}
    secondaryAction={
      <IconButton
        id={`schedule-list-item-${index}-icon-button`}
        edge='end'
        aria-label='comments'
        onClick={() => handleDeleteOnClick(task.taskId)}>
        <DeleteIcon
          id={`schedule-list-item-${index}-delete-button`}
        />
      </IconButton>
    }>
    <ListItemButton sx={{ width: '100%' }}>
      <ListItemIcon>
        <LinkIcon />
      </ListItemIcon>
      <ListItemText primary={task?.taskName} />
    </ListItemButton>
  </ListItem>
);

const ScheduleLinkList = ({ onScheduleClick }) => {
  const [scheduleLinks, setScheduleLinks] = useState([]);

  const {
    task: { tasks = [] },
    schedule: { schedule = {}, scheduleLoading = true },
  } = useSelector((x) => x);

  const dispatch = useDispatch();

  // Add link handler
  const handleAddScheduleOnClick = () => {
    dispatch(openDialog(dialogType.addLink));
  };

  const handleDeleteOnClick = (taskId) => {
    dispatch(removeSelectedScheduleLink(taskId));
  };

  useEffect(() => {
    !scheduleLoading &&
      setScheduleLinks(handleGetScheduleWithLinks(schedule, tasks));
  }, [schedule]);

  return (
    <div>
      <ScheduleLinkBoxHeader
        onAddScheduleClick={handleAddScheduleOnClick}
      />
      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box sx={{ marginTop: 2 }}>
              <ScheduleLinkListPaper>
                {scheduleLoading ? (
                  <Spinner />
                ) : (
                  <List>
                    {scheduleLinks?.links?.map((task, index) => (
                      <ScheduleLinkListItem
                        key={index}
                        task={task}
                        index={index}
                        handleDeleteOnClick={handleDeleteOnClick}
                      />
                    ))}
                  </List>
                )}
              </ScheduleLinkListPaper>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export { ScheduleLinkList };
