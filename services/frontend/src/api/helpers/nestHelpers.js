import { nestCommandNameMapping } from '../data/nest';

const getFormattedCommandName = (command) =>
  Object.keys(nestCommandNameMapping).includes(command)
    ? nestCommandNameMapping[command].name
    : 'Invalid';

const getFormattedCelsius = (value) => {
  return `${value}°C`;
};

export { getFormattedCommandName, getFormattedCelsius };
