import {
  CircularProgress,
  Container,
  List,
  ListSubheader,
  Paper,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeatures } from '../../store/features/featureActions';
import { FeatureListItem } from './FeatureListItem';

export default function FeatureList() {
  const dispatch = useDispatch();
  const features = useSelector((x) => x.feature.features);
  const featuresLoading = useSelector((x) => x.feature.featuresLoading);

  useEffect(() => {
    dispatch(getFeatures());
  }, []);

  return (
    <>
      {featuresLoading ? (
        <CircularProgress />
      ) : (
        <Container maxWidth='md'>
          <Paper>
            <List subheader={<ListSubheader>Features</ListSubheader>}>
              {features.map((feature) => (
                <FeatureListItem feature={feature} />
              ))}
            </List>
          </Paper>
        </Container>
      )}
    </>
  );
}
