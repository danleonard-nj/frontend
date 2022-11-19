import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import {
  Box,
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
import { updateScheduleState } from '../../../store/schedule/scheduleActions';
import { getTasks } from '../../../store/task/taskActions';
import DashboardLinkListHeader from '../links/DashboardLinkListHeader';

export default function ScheduleLinkList() {
  const dispatch = useDispatch();
  const schedule = useSelector((store) => store.schedule?.schedule) ?? {};
  const scheduleLoading = useSelector((x) => x.schedule.scheduleLoading);
  const tasks = useSelector((x) => x.task.tasks) ?? [];

  const [schedulesWithLinks, setSchedulesWithLinks] = useState([]);

  function getScheduleWithLinks(schedule, tasks) {
    const links = tasks.filter((x) =>
      (schedule.links ?? []).includes(x.taskId)
    );
    return { ...schedule, links: links };
  }

  function handleDelete(taskId) {
    dispatch(
      updateScheduleState((schedule) => ({
        ...schedule,
        links: schedule.links.filter((id) => id !== taskId),
      }))
    );
  }

  useEffect(() => {
    if (!tasks?.length) {
      dispatch(getTasks());
    }
    if (!scheduleLoading) {
      setSchedulesWithLinks(getScheduleWithLinks(schedule, tasks));
    }
  }, [schedule?.links]);

  return (
    <>
      <Box sx={{ marginBottom: 1 }}>
        <DashboardLinkListHeader />
      </Box>
      <Paper elevation={2} sx={{ p: 2 }}>
        <>
          <Grid id='schedule-link-list-grid' container sx={{ height: '100%' }}>
            <Grid item lg={12} md={12}>
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
                        <ListItemButton>
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
