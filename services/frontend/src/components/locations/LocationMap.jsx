import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  queryLocations,
  selectLocation,
} from '../../store/locations/locationActions';
import PlaceIcon from '@mui/icons-material/Place';
import { IconButton, styled } from '@mui/material';

const style = {
  ':hover': {
    color: '#000',
    cursor: 'pointer',
  },
};

const Marker = ({ location }) => {
  const dispatch = useDispatch();

  const onMarkerClick = (event) => {
    console.log(event);
    console.log('hit the button');
    console.log(location);
    dispatch(selectLocation(location));
    event.stopPropagation();
  };

  return (
    <IconButton onClick={onMarkerClick}>
      <PlaceIcon color='error' fontSize='large' />
    </IconButton>
  );
};

const defaultProps = {
  center: {
    lat: 33.5745223,
    lng: -111.9782943,
  },
  zoom: 11,
};

const LocationMap = () => {
  const dispatch = useDispatch();
  const locationsLoading = useSelector((x) => x.location.locationsLoading);
  const locations = useSelector((x) => x.location.locations) ?? [];

  const onClick = (data) => {
    dispatch(queryLocations(data.lat, data.lng));
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '75vh', width: '100%' }}>
      <GoogleMapReact
        onClick={onClick}
        bootstrapURLKeys={{ key: '' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}>
        {locations.map((location) => (
          <Marker
            sx={style}
            lat={location.latitude}
            lng={location.longitude}
            location={location}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export { LocationMap };
