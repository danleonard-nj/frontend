import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPodcasts } from '../../store/podcasts/podcastActions';
import Spinner from '../Spinner';

const DashboardPodcastLayout = () => {
  const { showsLoading = true, shows = [] } = useSelector(
    (x) => x.podcast
  );

  const [selectedShow, setSelectedShow] = React.useState('');

  const dispatch = useDispatch();

  const handleSelectShow = (show) => {
    setSelectedShow(show);
  };

  const PodcastList = ({ podcasts: shows }) => {
    return (
      <List>
        {shows.map((show) => (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleSelectShow(show)}
              selected={show.show_title == selectedShow.show_title}>
              <ListItemText primary={show.show_title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

  const EpisodeList = ({ show }) => {
    const episodes = show?.episodes || [];

    const handleSelectEpisode = (episode) => {
      window.open(episode.audio, '_blank');
    };

    return (
      <List>
        {episodes.map((episode) => (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleSelectEpisode(episode)}>
              <ListItemText primary={episode.episode_title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

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
              <PodcastList
                podcasts={shows}
                onClick={handleSelectShow}
              />
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
