import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemText,
  Switch,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  featureType,
  getAvatarColor,
  getAvatarLetter,
} from '../../api/helpers/featureHelpers';
import { popErrorMessage } from '../../store/alert/alertActions';
import {
  deleteFeature,
  updateFeatureValue,
} from '../../store/features/featureActions';

const FeatureListItem = ({ feature }) => {
  const dispatch = useDispatch();
  const [featureValue, setFeatureValue] = useState(feature?.value ?? '');

  const handleDelete = () => {
    dispatch(
      popErrorMessage('Delete is not currently supported from the frontend')
    );
    // dispatch(deleteFeature(feature?.feature_id));
  };

  const handleSetFeature = (event) => {
    setFeatureValue(event.target.checked);
    dispatch(updateFeatureValue(feature.feature_key, event.target.checked));
  };

  //   useEffect(() => {
  //   }, [featureValue]);

  return (
    <ListItem>
      <Tooltip title={feature?.description ?? ''} placement='left'>
        <Avatar
          sx={{
            bgcolor: getAvatarColor(feature?.feature_type ?? ''),
            marginRight: '1rem',
          }}>
          {getAvatarLetter(feature?.feature_type ?? '')}
        </Avatar>
      </Tooltip>

      <ListItemText
        id='switch-list-label-wifi'
        primary={feature?.feature_key ?? ''}
      />

      {feature?.feature_type == featureType.boolean && (
        <Switch
          edge='end'
          onChange={handleSetFeature}
          checked={featureValue ?? false}
          inputProps={{
            'aria-labelledby': 'switch-list-label-wifi',
          }}
        />
      )}

      {feature.feature_type !== featureType.boolean && (
        <IconButton aria-label='comment'>
          <EditIcon />
        </IconButton>
      )}
      <IconButton aria-label='comment' onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export { FeatureListItem };
