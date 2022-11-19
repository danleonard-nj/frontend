import LocationsApi from '../../api/reminders/locationsApi';
import { setLocation, setLocations } from './reminderSlice';

export function getLocations() {
  return async (dispatch, getState) => {
    const api = new LocationsApi();

    const locations = await api.getLocations();
    dispatch(setLocations(locations));
  };
}

export function setSelectedLocation(locationId) {
  return async (dispatch, getState) => {
    const state = getState();

    const location = state.reminders.locations.find(
      (x) => x.locationId == locationId
    );

    dispatch(setLocation(location));
  };
}

export function updateLocation(location) {
  return async (dispatch, getState) => {
    const api = new LocationsApi();
    const state = getState();

    const updatedLocations = state.reminders.notifications.map((x) =>
      x.locationId == location.locationId ? location : x
    );

    await api.updateLocation(location);
    dispatch(setLocations(updatedLocations));
  };
}

export function createLocation() {
  return async (dispatch, getState) => {
    const api = new LocationsApi();
    const state = getState();

    const location = await api.createLocation(state.reminders.location);
    dispatch(setLocations([...state.reminders.locations, location]));
  };
}

export function deleteLocation(locationId) {
  return async (dispatch, getState) => {
    const api = new LocationsApi();
    const state = getState();

    const updatedLocations = state.reminders.locations.filter(
      (x) => x.locationId != locationId
    );

    dispatch(setLocations(updatedLocations));
    await api.deleteLocation(locationId);
  };
}
