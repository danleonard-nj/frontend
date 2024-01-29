import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedShow } from '../../store/podcasts/podcastSlice';

const PodcastList = ({ podcasts: shows }) => {
  const { selectedShow = {} } = useSelector((x) => x.podcast);

  const dispatch = useDispatch();

  const handleSelectShow = (show) => {
    dispatch(setSelectedShow(show));
  };

  return (
    <List>
      {shows.map((show) => (
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleSelectShow(show)}
            selected={show.show_title === selectedShow.show_title}>
            <ListItemText primary={show.show_title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export { PodcastList };
