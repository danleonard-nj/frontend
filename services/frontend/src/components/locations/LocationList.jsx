import {
  Container,
  Grid,
  Slider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLocationTab,
  setQuerySettings,
} from '../../store/locations/locationSlice';
import Spinner from '../Spinner';
import { LocationCard } from './LocationCard';

const LocationDetailContainer = () => {
  const dispatch = useDispatch();

  const { locationTab = 0 } = useSelector((x) => x.location);

  const handleTabChange = (tab) => {
    dispatch(setLocationTab(tab));
  };

  return (
    <>
      <Tabs
        value={locationTab}
        onChange={(event, tab) => handleTabChange(tab)}>
        <Tab label='Query' value={0} />

        <Tab label='Locations' value={1} />
        <Tab label='Marker' value={2} />
      </Tabs>

      {locationTab === 0 && <LocationQuerySettings />}
      {locationTab === 1 && <LocationList />}
      {locationTab === 2 && <MarkerSelectedLocation />}
    </>
  );
};

const LocationQuerySettings = () => {
  const dispatch = useDispatch();
  const querySettings = useSelector((x) => x.location.querySettings);

  const [distanceValue, setDistanceValue] = useState(
    querySettings?.distance ?? 0
  );

  const [limitValue, setLimitValue] = useState(
    querySettings?.limit ?? 0
  );

  const handleDistanceChange = (value) => {
    console.log('commited');
    dispatch(setQuerySettings({ ...querySettings, range: value }));
  };

  const handleLimitChange = (value) => {
    console.log('commited');
    dispatch(setQuerySettings({ ...querySettings, limit: value }));
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item lg={12} sx={{ marginTop: 3 }}>
          <Typography gutterBottom>Distance</Typography>
          <Slider
            aria-label='Miles'
            value={distanceValue}
            valueLabelDisplay='auto'
            onChangeCommitted={(event, value) =>
              handleDistanceChange(value)
            }
            onChange={(event, value) => setDistanceValue(value)}
            step={1}
            marks
            min={1}
            max={25}
          />
        </Grid>
        <Grid item lg={12}>
          <Typography gutterBottom>Limit</Typography>
          <Slider
            aria-label='Limit'
            value={limitValue}
            valueLabelDisplay='auto'
            onChangeCommitted={(event, value) =>
              handleLimitChange(value)
            }
            onChange={(event, value) => setLimitValue(value)}
            step={5}
            marks
            min={5}
            max={100}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

const LocationList = () => {
  const { locations = [], locationsLoading = false } =
    useSelector((x) => x.location) ?? [];

  return locationsLoading ? (
    <Container>
      <Spinner />
    </Container>
  ) : (
    locations.map((location) => (
      <>
        <LocationCard location={location} /> <br />
      </>
    ))
  );
};

const MarkerSelectedLocation = () => {
  const { selectedLocation } = useSelector((x) => x.location);

  return (
    selectedLocation && <LocationCard location={selectedLocation} />
  );
};

export { LocationList, LocationDetailContainer };
