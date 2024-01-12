import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

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
            <ListItemTextt primary={episode.episode_title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export { EpisodeList };
