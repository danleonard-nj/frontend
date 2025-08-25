import { List, ListSubheader, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { FeatureListItem } from './FeatureListItem';

export default function FeatureList({
  searchTerm = '',
  typeFilter = '',
}) {
  const features = useSelector((x) => x.feature.features) || [];

  const normalized = searchTerm.trim().toLowerCase();

  const filtered = features.filter((f) => {
    const matchesSearch =
      !normalized ||
      f.name?.toLowerCase().includes(normalized) ||
      f.feature_key?.toLowerCase().includes(normalized);
    const matchesType = !typeFilter || f.feature_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Paper>
      <List subheader={<ListSubheader>Features</ListSubheader>}>
        {filtered.map((feature) => (
          <FeatureListItem
            feature={feature}
            key={feature.feature_id}
          />
        ))}
      </List>
    </Paper>
  );
}
