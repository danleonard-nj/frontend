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
      const { searchTerm, page, torrentSource } = getState().torrents;

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
        page,
        torrentSource
      );

      response?.status === 200
        ? dispatch(setTorrents(response.data))
        : handleErrorResponse(response);

      dispatch(setTorrentsLoading(false));
    };
  }

  getMagnet(data) {
    return async (dispatch, getState) => {
      const { torrentSource } = getState().torrents;

      // Handle success/failure toasts and formatting
      const handleErrorResponse = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(
              `Failed to fetch magnet link: ${JSON.stringify(data)}`
            )
          );
        }
      };

      dispatch(setMagnetLoading(true));

      const getPayloadData = () => {
        switch (torrentSource) {
          case 'piratebay': {
            return {
              id: data.data.id,
              info_hash: data.data.info_hash,
              name: data.data.name,
            };
          }
          case '1337x': {
            return { stub: data.data.stub };
          }
        }
      };

      const response = await this.torrentApi.getMagentLink({
        target: torrentSource,
        data: getPayloadData(),
      });

      response?.status === 200
        ? dispatch(setMagent(response.data))
        : handleErrorResponse(response);

      dispatch(setMagnetLoading(false));
    };
  }
}

export const { searchTorrents, getMagnet } = new TorrentActions();
