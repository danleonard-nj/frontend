import { Container, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPodcasts } from '../../store/podcasts/podcastActions';

const DashboardPodcastLayout = () => {
  const { showsLoading = true } = useSelector((x) => x.podcast);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPodcasts());
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h4'>Podcasts</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body1'>
            {showsLoading
              ? 'Loading...'
              : 'Podcasts loaded successfully'}
          </Typography>
        </Grid>
      </Grid>
      {/* <FeatureTopMenu /> */}
      {/* {featuresLoading ? <Spinner /> : <FeatureList />} */}
    </Container>
  );
};

export { DashboardPodcastLayout };
