import { Container } from '@mui/material';
import React from 'react';
import FeatureList from '../features/FeatureList';
import FeatureTopMenu from '../features/FeatureTopMenu';

export default function DashboardFeatureLayout() {
  return (
    <>
      <FeatureTopMenu />
      <FeatureList />
    </>
  );
}
