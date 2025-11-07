import autoBind from 'auto-bind';
import RedisManagementApi from '../../api/redisApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setCacheValue,
  setCacheValueLoading,
  setParseJson,
  setRedisDiagnostics,
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

      const sortRedisKeys = (keys) => {
        return keys.sort((a, b) => {
          return a.localeCompare(b);
        });
      };

      dispatch(setRedisKeysLoading(true));

      const response = await this.redisApi.getKeys();

      response?.status === 200
        ? dispatch(
            setRedisKeys(sortRedisKeys(response.data?.keys || []))
          )
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

      if (response?.status === 200) {
        dispatch(popMessage(`Key '${key}' deleted successfully`));
        // Refresh keys and clear selection/cache if the deleted key was selected
        const {
          redis: { selectedKey },
        } = getState();
        if (selectedKey === key) {
          dispatch(setSelectedKey(''));
          dispatch(setCacheValue({}));
        }
        dispatch(this.getRedisKeys());
      } else {
        handleErrorResponse(response);
      }

      // dispatch(setCacheValueLoading(false));
    };
  }

  setRedisValue(key, value, parseJson = false) {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(`${data?.error}: ${data?.message}`)
          );
        }
      };

      const response = await this.redisApi.setValue(
        key,
        value,
        parseJson
      );

      if (response?.status === 200) {
        dispatch(popMessage(`Key '${key}' saved`));
        // Re-fetch to reflect TTL/value from server
        dispatch(this.getRedisValue(key, parseJson));
        // refresh list in case a new key was created
        dispatch(this.getRedisKeys());
      } else {
        handleErrorResponse(response);
      }
    };
  }

  setSelectedRedisKey(key) {
    return async (dispatch, getState) => {
      console.log('setSelectedRedisKey', key);
      dispatch(setParseJson(false));
      dispatch(setSelectedKey(key));
    };
  }

  getRedisDiagnostics() {
    return async (dispatch, getState) => {
      // Handle success/failure toasts and formatting
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(`${data?.error}: ${data?.message}`)
          );
        }
      };

      console.log('getRedisDiagnostics');

      // dispatch(setCacheValueLoading(true));

      const response = await this.redisApi.getDiagnostics();

      console.log('response', response);

      response?.status === 200
        ? dispatch(setRedisDiagnostics(response.data))
        : handleErrorResponse(response);

      // dispatch(setCacheValueLoading(false));
    };
  }
}

export const {
  getRedisKeys,
  getRedisValue,
  setSelectedRedisKey,
  deleteRedisKey,
  getRedisDiagnostics,
  setRedisValue,
} = new RedisActions();
