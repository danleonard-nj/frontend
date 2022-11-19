import { get } from 'ace-builds/src-noconflict/ace';
import LocationApi from '../../api/locationApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setLocations,
  setLocationsLoading,
  setLocationTab,
  setSelectedLocation,
} from './locationSlice';

export function queryLocations(latitude, longitude, miles, limit) {
  return async (dispatch, getState) => {
    const state = getState();

    const querySettings = state.location.querySettings;

    dispatch(setLocationsLoading(true));

    const api = new LocationApi();
    dispatch(popMessage('Querying location...'));

    const query = {
      ...querySettings,
      latitude: latitude,
      longitude: longitude,
    };

    console.log(query);

    const locations = await api.query(query);

    if (locations.status !== 200) {
      const errorMessage = locations.data?.message;
      dispatch(
        popErrorMessage(
          `Failed to query location: ${errorMessage ?? 'Exception occured'}`
        )
      );
    } else {
      dispatch(popMessage('Location data fetched successfully!'));
      dispatch(setLocations(locations.data));
    }
  };
}

export function selectLocation(location) {
  return async (dispatch, getState) => {
    dispatch(setSelectedLocation(location));
    dispatch(setLocationTab(2));
  };
}
