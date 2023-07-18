import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import {
  formatForecastDay,
  getFormattedFahrenheit,
  getFormattedPercent,
} from '../../../api/helpers/nestHelpers';
import { ForecastDayCardDisplayField } from './ForecastDayCardDisplayField';

const DailyForecastCard = ({ forecast }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' align='center' gutterBottom>
          {formatForecastDay(forecast?.date)}
        </Typography>
        <ForecastDayCardDisplayField
          label='High'
          value={getFormattedFahrenheit(forecast?.temperature_max)}
        />
        <ForecastDayCardDisplayField
          label='Low'
          value={getFormattedFahrenheit(forecast?.temperature_min)}
        />
        <ForecastDayCardDisplayField
          label='Humidity'
          value={getFormattedPercent(forecast?.humidity)}
        />
        <ForecastDayCardDisplayField
          label='Feels Like'
          value={getFormattedFahrenheit(forecast?.feels_like)}
        />
      </CardContent>
    </Card>
  );
};

export { DailyForecastCard };
