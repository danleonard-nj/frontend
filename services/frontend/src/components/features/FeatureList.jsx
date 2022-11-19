import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Switch,
  Tooltip,
} from '@mui/material';
import { blue, green, red } from '@mui/material/colors';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFeature,
  getFeatures,
  setFeature,
} from '../../store/features/featureActions';
import {
  openSnackbar,
  updateFeatureListItem,
} from '../../store/features/featureSlice';

const featureType = {
  boolean: 1,
  string: 2,
  array: 3,
};

const getAvatarLetter = (typeName) => {
  return typeName[0].toUpperCase();
};

const getAvatarColor = (type) => {
  switch (type) {
    case featureType.string:
      return green[500];
    case featureType.boolean:
      return blue[500];
    case featureType.boolean:
      return red[500];
  }
};

const FeatureListItem = ({ feature }) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(deleteFeature(feature.feature_id));
  };

  const handleSetFeature = (event) => {
    dispatch(
      updateFeatureListItem({ ...feature, value: event.target.checked })
    );
    dispatch(
      openSnackbar({
        open: true,
        message: `Feature set: ${event.target.checked}`,
        close: 1000,
      })
    );
  };

  useEffect(() => {
    dispatch(setFeature(feature.feature_key, feature.value));
  }, [feature.value]);

  return (
    <ListItem>
      <Tooltip title={feature.description} placement='left'>
        <Avatar
          sx={{
            bgcolor: getAvatarColor(feature.type_id),
            marginRight: '1rem',
          }}>
          {getAvatarLetter(feature.type_name)}
        </Avatar>
      </Tooltip>

      <ListItemText id='switch-list-label-wifi' primary={feature.feature_key} />

      {feature.type_id == featureType.boolean && (
        <Switch
          edge='end'
          onChange={handleSetFeature}
          checked={feature.value}
          inputProps={{
            'aria-labelledby': 'switch-list-label-wifi',
          }}
        />
      )}

      <IconButton aria-label='comment'>
        <EditIcon />
      </IconButton>
      <IconButton aria-label='comment' onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default function FeatureList() {
  const dispatch = useDispatch();
  const features = useSelector((x) => x.feature.features);
  const featuresFetched = useSelector((x) => x.feature.featuresFetched);

  useEffect(() => {
    dispatch(getFeatures());
  }, []);

  return (
    <>
      {!featuresFetched ? (
        <CircularProgress />
      ) : (
        <Paper>
          <List subheader={<ListSubheader>Features</ListSubheader>}>
            {features.map((feature) => (
              <FeatureListItem feature={feature} />
            ))}
          </List>
        </Paper>
      )}
    </>
  );
}
