import { Container } from '@mui/material';
import React, { useState } from 'react';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  return (
    <Container>
      <FeatureTopMenu
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
      {featuresLoading ? (
        <Spinner />
      ) : (
        <FeatureList
          searchTerm={searchTerm}
          typeFilter={typeFilter}
        />
      )}
    </Container>
  );
};

export { DashboardFeatureLayout };
