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
        <ListItem disablePadding key={episode.episode_id}>
          <ListItemButton
            onClick={() => handleSelectEpisode(episode)}>
            <ListItemText primary={episode.episode_title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export { EpisodeList };
