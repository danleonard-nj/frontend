import autoBind from 'auto-bind';
import WeatherApi from '../../api/weatherApi';
import { popErrorMessage } from '../alert/alertActions';
import { setWeather, setWeatherLoading } from './weatherSlice';

export default class WeatherActions {
  constructor() {
    this.weatherApi = new WeatherApi();
    autoBind(this);
  }

  getWeather() {
    return async (dispatch, getState) => {
      const { zipCode } = getState().weather;

      // Handle success/failure toasts and formatting
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage('Failed to fetch chat weather info')
          );
        }
      };

      dispatch(setWeatherLoading(true));

      const response = await this.weatherApi.getWeather(zipCode);

      response?.status === 200
        ? dispatch(setWeather(response.data))
        : handleErrorResponse(response);

      dispatch(setWeatherLoading(false));
    };
  }
}

export const { getWeather } = new WeatherActions();
