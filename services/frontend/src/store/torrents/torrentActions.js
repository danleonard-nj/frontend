import autoBind from 'auto-bind';
import TorrentApi from '../../api/torrentsApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setMagent,
  setMagnetLoading,
  setTorrents,
  setTorrentsLoading,
} from './torrentSlice';

export default class TorrentActions {
  constructor() {
    this.torrentApi = new TorrentApi();
    autoBind(this);
  }

  searchTorrents() {
    return async (dispatch, getState) => {
      const { searchTerm, page } = getState().torrents;

      // Handle success/failure toasts and formatting
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(
              `Failed to fetch torrents for search term:  ${searchTerm}`
            )
          );
        }
      };

      dispatch(setTorrentsLoading(true));

      const response = await this.torrentApi.getTorrents(
        searchTerm,
        page
      );

      response?.status === 200
        ? dispatch(setTorrents(response.data))
        : handleErrorResponse(response);

      dispatch(setTorrentsLoading(false));
    };
  }

  getMagnet(stub) {
    return async (dispatch, getState) => {
      // Handle success/failure toasts and formatting
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(
              `Failed to fetch magnet link for stub:  ${stub}`
            )
          );
        }
      };

      dispatch(setMagnetLoading(true));

      const response = await this.torrentApi.getMagentLink(stub);

      response?.status === 200
        ? dispatch(setMagent(response.data))
        : handleErrorResponse(response);

      dispatch(setMagnetLoading(false));
    };
  }
}

export const { searchTorrents, getMagnet } = new TorrentActions();
