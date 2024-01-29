import { nestCommandNameMapping } from '../data/nest';

const getFormattedCommandName = (command) =>
  Object.keys(nestCommandNameMapping).includes(command)
    ? nestCommandNameMapping[command].name
    : 'Invalid';

const getFormattedCelsius = (value) => {
  return `${value}°C`;
};

const getLocation = (weather) => {
  return `${weather.location_name}, ${weather.location_zipcode}`;
};

const getWindInfo = (weather) => {
  return `${weather?.wind_speed ?? 'N/A'}mph @ ${
    weather?.wind_degrees ?? 'N/A'
  } degrees`;
};

const formatForecastDay = (date) => {
  const parsed = new Date(date);
  const dateSegment = parsed.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  const dayName = parsed.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  return `${dayName}, ${dateSegment}`;
};

const getFormattedFahrenheit = (temp) => {
  return `${temp} °F`;
};

const getFormattedPercent = (value) => {
  return `${value}%`;
};

const getMappedNameOrDefault = (key, map, defaultValue = null) => {
  if (key in map) {
    return map[key];
  }

  return defaultValue ?? key;
};

const formatDescription = (description) => {
  const chars = description.split('');

  return [...chars[0].toUpperCase(), ...chars.slice(1)].join('');
};

export {
  getFormattedCommandName,
  getFormattedCelsius,
  getLocation,
  getWindInfo,
  getFormattedFahrenheit,
  getFormattedPercent,
  formatForecastDay,
  getMappedNameOrDefault,
  formatDescription,
};
