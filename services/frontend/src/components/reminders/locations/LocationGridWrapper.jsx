import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getLocations } from '../../../store/reminders/locationActions';
import { LocationGrid } from './LocationGrid';

export const LocationGridWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('outer use effect loop');
    dispatch(getLocations());
  }, []);

  return <LocationGrid />;
};
