const getLocationName = (location) => {
  if (!location.reverse_geocoded?.locations?.length) {
    return `Lat/Long: ${location.latitude},${location.longitude}`;
  } else {
    const topReverseGeo = location.reverse_geocoded.locations[0];
    return topReverseGeo.address;
  }
};

export { getLocationName };
