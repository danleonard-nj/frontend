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
import { updateScheduleState } from '../../../store/schedule/scheduleActions';
import DashboardTitle from '../../dashboard/DashboardTitle';

export default function ScheduleLinkList() {
  const dispatch = useDispatch();

  // Task and schedule list
  const tasks = useSelector((x) => x.task.tasks) ?? [];
  const { schedule, scheduleLoading } =
    useSelector((store) => store.schedule) ?? {};

  const [schedulesWithLinks, setSchedulesWithLinks] = useState([]);

  // Fetch and Populate schedule links
  const handleGetScheduleWithLinks = (schedule, tasks) => {
    // Get schedules and list of all tasks not
    // linked to this task
    const links = tasks.filter((x) =>
      (schedule.links ?? []).includes(x.taskId)
    );
    return { ...schedule, links: links };
  };

  // Add link handler
  const handleOpenAddScheduleLinkDialog = () => {
    dispatch(openDialog(dialogType.addLink));
  };

  // Delete task handler
  const handleDelete = (taskId) => {
    dispatch(
      updateScheduleState((schedule) => ({
        ...schedule,
        links: schedule.links.filter((id) => id !== taskId),
      }))
    );
  };

  useEffect(() => {
    !scheduleLoading &&
      setSchedulesWithLinks(
        handleGetScheduleWithLinks(schedule, tasks)
      );
  }, [schedule?.links]);

  return (
    <>
      <Box sx={{ marginBottom: 1 }}>
        <Grid container id='schedule-link-list-header-grid'>
          <Grid
            item
            lg={10}
            xs={6}
            id='schedule-link-list-header-container'>
            <DashboardTitle>Links</DashboardTitle>
          </Grid>
          <Grid
            item
            lg={2}
            xs={6}
            align='right'
            id='schedule-link-add-link-button-container'>
            <Button
              id='schedule-link-add-link-button'
              variant='text'
              onClick={handleOpenAddScheduleLinkDialog}>
              Link
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Paper elevation={2} sx={{ p: 2 }}>
        <>
          <Grid
            id='schedule-link-list-grid'
            container
            sx={{ height: '100%' }}>
            <Grid item lg={12} md={12} sm={12}>
              <Box sx={{ marginTop: 2 }}>
                <Paper
                  id='schedule-link-list-paper'
                  elevation={1}
                  sx={{ minHeight: '2rem' }}>
                  <List id='schedule-link-list'>
                    {schedulesWithLinks?.links?.map((task, index) => (
                      <ListItem
                        disablePadding
                        key={index}
                        id={`schedule-list-item-${index}`}
                        secondaryAction={
                          <IconButton
                            id={`schedule-list-item-${index}-icon-button`}
                            edge='end'
                            aria-label='comments'
                            onClick={() => handleDelete(task.taskId)}>
                            <DeleteIcon
                              id={`schedule-list-item-${index}-delete-button`}
                            />
                          </IconButton>
                        }>
                        <ListItemButton sx={{ wudth: '100%' }}>
                          <ListItemIcon>
                            <LinkIcon />
                          </ListItemIcon>
                          <ListItemText primary={task?.taskName} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </>
      </Paper>
    </>
  );
}
