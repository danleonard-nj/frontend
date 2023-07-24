import { List, ListSubheader, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { FeatureListItem } from './FeatureListItem';

export default function FeatureList() {
  const features = useSelector((x) => x.feature.features);

  return (
    <Paper>
      <List subheader={<ListSubheader>Features</ListSubheader>}>
        {features.map((feature) => (
          <FeatureListItem feature={feature} />
        ))}
      </List>
    </Paper>
  );
}
