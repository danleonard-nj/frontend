import { CircularProgress, List, ListSubheader, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeatures } from '../../store/features/featureActions';
import { FeatureListItem } from './FeatureListItem';

export default function FeatureList() {
  const dispatch = useDispatch();
  const features = useSelector((x) => x.feature.features);
  const featuresLoading = useSelector((x) => x.feature.featuresLoading);

  console.log('rendered feature list', featuresLoading, features);

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
}
