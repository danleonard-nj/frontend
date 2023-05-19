import {
  CircularProgress,
  List,
  ListSubheader,
  Paper,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeatures } from '../../store/features/featureActions';
import { FeatureListItem } from './FeatureListItem';

const FeatureList = () => {
  const dispatch = useDispatch();

  const { features, featuresLoading } = useSelector((x) => x.feature);

  useEffect(() => {
    dispatch(getFeatures());
  }, []);

  return (
    <>
      {featuresLoading ? (
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
};

export { FeatureList };
