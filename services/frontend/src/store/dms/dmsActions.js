import autoBind from 'auto-bind';
import DmsApi from '../../api/dmsApi';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage } from '../alert/alertActions';
import {
  setDisarm,
  setDisarmLoading,
  setDms,
  setDmsLoading,
} from './dmsSlice';

class DmsActions {
  constructor() {
    autoBind(this);
    this.dmsApi = new DmsApi();
  }

  pollDms() {
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

      dispatch(setDmsLoading(true));

      const response = await this.dmsApi.poll();

      handleResponse(response);

      dispatch(setDmsLoading(false));
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
        }
      };

      dispatch(setDisarmLoading(true));

      const response = await this.dmsApi.disarm();

      handleResponse(response);

      dispatch(setDisarmLoading(false));
    };
  }
}

export const { pollDms, disarmDms } = new DmsActions();
