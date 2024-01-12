import { Container, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPodcasts } from '../../store/podcasts/podcastActions';
import Spinner from '../Spinner';
import { EpisodeList } from '../podcasts/EpisodeList';
import { PodcastList } from '../podcasts/PodcastList';

const DashboardPodcastLayout = () => {
  const {
    showsLoading = true,
    shows = [],
    selectedShow = {},
  } = useSelector((x) => x.podcast);

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
        <Grid item xs={6}>
          <Typography variant='body1'>
            {showsLoading ? (
              <Spinner />
            ) : (
              <PodcastList podcasts={shows} />
            )}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body1'>
            {selectedShow && <EpisodeList show={selectedShow} />}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export { DashboardPodcastLayout };
