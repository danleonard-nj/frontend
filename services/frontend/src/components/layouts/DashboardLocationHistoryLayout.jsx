import { Box, Container, Grid, Paper } from '@mui/material';
import React from 'react';
import { scrollable } from '../../api/helpers/formattingHelpers';
import { LocationDetailContainer } from '../locations/LocationList';
import { LocationMap } from '../locations/LocationMap';

const DashboardLocationHistoryLayout = () => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Container>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Grid container spacing={3}>
              <Grid item lg={8}>
                <LocationMap />
              </Grid>
              <Grid item lg={4}>
                <Box sx={scrollable}>
                  <LocationDetailContainer />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export { DashboardLocationHistoryLayout };
