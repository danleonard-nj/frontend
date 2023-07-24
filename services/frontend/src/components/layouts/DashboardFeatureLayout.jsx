import { Container } from '@mui/material';
import React from 'react';
import FeatureList from '../features/FeatureList';
import { FeatureTopMenu } from '../features/FeatureTopMenu';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../Spinner';
import { useEffect } from 'react';
import { getFeatures } from '../../store/features/featureActions';

const DashboardFeatureLayout = () => {
  const { featuresLoading = true } = useSelector((x) => x.feature);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeatures());
  }, []);

  return (
    <Container>
      <FeatureTopMenu />
      {featuresLoading ? <Spinner /> : <FeatureList />}
    </Container>
  );
};

export { DashboardFeatureLayout };
