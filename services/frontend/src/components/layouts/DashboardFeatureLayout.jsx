import { Container } from '@mui/material';
import React from 'react';
import { FeatureList } from '../features/FeatureList';
import { FeatureTopMenu } from '../features/FeatureTopMenu';

const DashboardFeatureLayout = () => {
  return (
    <Container>
      <FeatureTopMenu />
      <FeatureList />
    </Container>
  );
};

export { DashboardFeatureLayout };
