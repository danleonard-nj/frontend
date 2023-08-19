import autoBind from 'auto-bind';
import EventApi from '../../api/eventApi';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage } from '../alert/alertActions';
import { setEvents, setEventsLoading } from './apiEventSlice';
import { orderBy, sortBy } from 'lodash';

const getISODate = (date) => date.toISOString().split('T')[0];

export default class ApiEventActions {
  constructor() {
    this.eventApi = new EventApi();
    autoBind(this);
  }

  sortEventsByDate(events) {
    return orderBy(events, (event) => event.timestamp, 'desc');
  }

  getEventHistory(startTimestamp) {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data, status }) => {
        dispatch(
          popErrorMessage(
            `${status}: Failed to fetch events: ${getErrorMessage(
              data
            )}`
          )
        );
      };

      dispatch(setEventsLoading(true));

      const response = await this.eventApi.getEvents(startTimestamp);

      response.status === 200
        ? dispatch(setEvents(this.sortEventsByDate(response.data)))
        : handleErrorResponse(response);

      dispatch(setEventsLoading(false));
    };
  }
}

export const { getEventHistory } = new ApiEventActions();
