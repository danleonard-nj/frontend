import { Container } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';

const DashboardPodcastsLayout = () => {
  //   const { featuresLoading = true } = useSelector((x) => x.feature);

  const dispatch = useDispatch();

  //   useEffect(() => {
  //     dispatch(getFeatures());
  //   }, []);

  return (
    <Container>
      {/* <FeatureTopMenu /> */}
      {/* {featuresLoading ? <Spinner /> : <FeatureList />} */}
    </Container>
  );
};

export { DashboardPodcastsLayout };
