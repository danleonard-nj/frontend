import autoBind from 'auto-bind';
import RedisManagementApi from '../../api/redisApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setCacheValue,
  setCacheValueLoading,
  setParseJson,
  setRedisKeys,
  setRedisKeysLoading,
  setSelectedKey,
} from './redisSlice';

export default class RedisActions {
  constructor() {
    this.redisApi = new RedisManagementApi();
    autoBind(this);
  }

  getRedisKeys() {
    return async (dispatch, getState) => {
      // Handle success/failure toasts and formatting
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch Redis key list'));
        }
      };

      dispatch(setRedisKeysLoading(true));

      const response = await this.redisApi.getKeys();

      response?.status === 200
        ? dispatch(setRedisKeys(response.data?.keys || []))
        : handleErrorResponse(response);

      dispatch(setRedisKeysLoading(false));
    };
  }

  getRedisValue(key, parseJson = false) {
    return async (dispatch, getState) => {
      // Handle success/failure toasts and formatting
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(`${data?.error}: ${data?.message}`)
          );
        }
      };

      dispatch(setCacheValueLoading(true));

      const response = await this.redisApi.getValue(key, parseJson);

      response?.status === 200
        ? dispatch(setCacheValue(response.data))
        : handleErrorResponse(response);

      dispatch(setCacheValueLoading(false));
    };
  }

  deleteRedisKey(key) {
    return async (dispatch, getState) => {
      // Handle success/failure toasts and formatting
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(`${data?.error}: ${data?.message}`)
          );
        }
      };

      // dispatch(setCacheValueLoading(true));

      const response = await this.redisApi.deleteKey(key);

      response?.status === 200
        ? dispatch(popMessage(`Key '${key}' deleted successfully`))
        : handleErrorResponse(response);

      // dispatch(setCacheValueLoading(false));
    };
  }

  setSelectedRedisKey(key) {
    return async (dispatch, getState) => {
      console.log('setSelectedRedisKey', key);
      dispatch(setParseJson(false));
      dispatch(setSelectedKey(key));
    };
  }
}

export const {
  getRedisKeys,
  getRedisValue,
  setSelectedRedisKey,
  deleteRedisKey,
} = new RedisActions();
