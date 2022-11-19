import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';
import { getLocationName } from '../../api/data/locations';
import { toLocalDateTime } from '../../api/helpers/dateTimeUtils';

const LocationCard = ({ location }) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant='outlined'>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            Address
          </Typography>
          {/* <Typography variant='h5' component='div'>
          Miles: {location.distance.miles}
          Feet: {location.distance.feet}
        </Typography> */}
          <Typography variant='h5' component='div'>
            {getLocationName(location)}
          </Typography>
          <br />
          <Typography sx={{ fontSize: 14 }} color='text.secondary'>
            Coordinate Key
          </Typography>
          <Typography variant='body2'>{location.coordinate_key}</Typography>
          <br />
          <Typography variant='h5' component='div'>
            Locations
          </Typography>

          {location.reverse_geocoded.locations.map((geo) => (
            <>
              <Typography sx={{ fontSize: 14 }} color='text.secondary'>
                Address
              </Typography>
              <Typography variant='body2'>{geo.address}</Typography>
              <Typography sx={{ fontSize: 14 }} color='text.secondary'>
                Location Type
              </Typography>
              {geo.types?.length
                ? geo.types.map((locationType) => (
                    <Typography inline variant='body2'>
                      {locationType}
                    </Typography>
                  ))
                : 'No types'}
              <Typography sx={{ fontSize: 14 }} color='text.secondary'>
                Place:
              </Typography>
              <Typography variant='body2'>{geo.place_id}</Typography>
              <br />
            </>
          ))}
          <br />
          <Typography variant='h5' component='div'>
            Details
          </Typography>
          <Typography sx={{ fontSize: 14 }} color='text.secondary'>
            Sources
          </Typography>
          <Typography variant='body2'>
            {location?.sources?.length
              ? location?.sources.map((locationSource) => (
                  <Typography variant='body2'>{locationSource}</Typography>
                ))
              : 'No sources'}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color='text.secondary'>
            Date
          </Typography>
          <Typography variant='body2'>
            {location?.timestamps?.length
              ? location?.timestamps.map((timestamp) => (
                  <Typography variant='body2'>
                    {toLocalDateTime(timestamp)}
                  </Typography>
                ))
              : 'No datetime data'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export { LocationCard };
