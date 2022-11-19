import { Button, Grid } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { dialogType, openDialog } from '../../../store/dialog/dialogSlice';
import DashboardTitle from '../../dashboard/DashboardTitle';

export default function DashboardLinkListHeader() {
  const dispatch = useDispatch();

  function handleOpenDialog() {
    dispatch(openDialog(dialogType.addLink));
  }

  return (
    <>
      <Grid container id='schedule-link-list-header-grid'>
        <Grid item lg={10} xs={6} id='schedule-link-list-header-container'>
          <DashboardTitle>Links</DashboardTitle>
        </Grid>
        <Grid
          item
          lg={2}
          xs={6}
          align='right'
          id='schedule-link-add-link-button-container'>
          <Button
            id='schedule-ink-add-link-button'
            variant='text'
            onClick={handleOpenDialog}>
            Link
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
