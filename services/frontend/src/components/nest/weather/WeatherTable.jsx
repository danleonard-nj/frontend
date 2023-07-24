import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import {
  getLocation,
  getWindInfo,
} from '../../../api/helpers/nestHelpers';
import { DailyMinMaxDisplay } from './DailyMinMaxDisplay';
import { DailySunriseSunsetDisplay } from './DailySunriseSunsetDisplay';
import { DailyLatLongDisplay } from './DailyLatLongDisplay';

const formatDescription = (description) => {
  const chars = description.split('');

  return [...chars[0].toUpperCase(), ...chars.slice(1)].join('');
};

const WeatherTable = ({ weather }) => (
  <Grid container spacing={3}>
    <Grid item lg={6}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Location</TableCell>
            <TableCell>{getLocation(weather)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temperature</TableCell>
            <TableCell>{weather?.temperature ?? 'N/A'} °F</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              {formatDescription(weather?.weather_description) ??
                'N/A'}
            </TableCell>
          </TableRow>
          {weather?.response?.rain && (
            <TableRow>
              <TableCell>Rain</TableCell>
              <TableCell>
                {JSON.stringify(weather?.response?.rain, null, 4)}
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Hi/Lo</TableCell>
            <TableCell>
              {<DailyMinMaxDisplay weather={weather} />}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Feels Like</TableCell>
            <TableCell>{weather.feels_like} °F</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Humidity</TableCell>
            <TableCell>{weather.humidity}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Wind</TableCell>
            <TableCell>{getWindInfo(weather)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pressure</TableCell>
            <TableCell>{weather.pressure}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sunrise / Sunset</TableCell>
            <TableCell>
              {<DailySunriseSunsetDisplay weather={weather} />}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Lat/Long</TableCell>
            <TableCell>
              {<DailyLatLongDisplay weather={weather} />}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Grid>
  </Grid>
);

export { WeatherTable };
