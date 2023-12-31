import autoBind from 'auto-bind';
import DmsApi from '../../api/dmsApi';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setDisarm,
  setDisarmLoading,
  setDms,
  setDmsLoading,
  setHistory,
  setHistoryLoading,
} from './dmsSlice';

class DmsActions {
  constructor() {
    autoBind(this);
    this.dmsApi = new DmsApi();
  }

  pollDms(useLoadingFlags = true) {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          const errorMessage = getErrorMessage(data);
          dispatch(popErrorMessage(errorMessage));
        } else {
          // Store the poll result
          dispatch(setDms(data));
        }
      };

      useLoadingFlags && dispatch(setDmsLoading(true));

      const response = await this.dmsApi.poll();

      handleResponse(response);

      useLoadingFlags && dispatch(setDmsLoading(false));
    };
  }

  getHistory(daysBack) {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          const errorMessage = getErrorMessage(data);
          dispatch(popErrorMessage(errorMessage));
        } else {
          // Store the poll result
          dispatch(setHistory(data));
        }
      };

      dispatch(setHistoryLoading(true));

      // Fetch event history
      const response = await this.dmsApi.getHistory(daysBack);

      handleResponse(response);

      dispatch(setHistoryLoading(false));
    };
  }

  disarmDms() {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to disarm
          const errorMessage = getErrorMessage(data);
          dispatch(popErrorMessage(errorMessage));
        } else {
          // Store the disarm result
          dispatch(setDisarm(data));
          dispatch(popMessage('DMS disarmed!'));
        }
      };

      dispatch(setDisarmLoading(true));

      const response = await this.dmsApi.disarm();

      handleResponse(response);

      dispatch(setDisarmLoading(false));
    };
  }
}

export const { pollDms, disarmDms, getHistory } = new DmsActions();
