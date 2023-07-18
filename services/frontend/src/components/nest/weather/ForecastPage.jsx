import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DailyForecastCard } from './DailyForecastCard';
import { getForecast } from '../../../store/weather/weatherActions';
import Spinner from '../../Spinner';

const ForecastPage = () => {
  const { forecast, forecastLoading } = useSelector((x) => x.weather);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getForecast());
  }, []);

  const ForecastPageContent = () => {
    return (
      <Grid container spacing={3}>
        {forecast?.map((day) => (
          <Grid item lg={3}>
            <DailyForecastCard forecast={day} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return forecastLoading ? <Spinner /> : <ForecastPageContent />;
};

export { ForecastPage };
