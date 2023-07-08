import { first } from 'lodash';

const getLocationName = (location) => {
  const topReverseGeo = first(location.reverse_geocoded?.locations);

  console.log(topReverseGeo);

  return (
    topReverseGeo?.address ||
    `Lat/Long: ${location.latitude},${location.longitude}`
  );
};

export { getLocationName };
