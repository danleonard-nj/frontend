import autoBind from 'auto-bind';
import PodcastApi from '../../api/podcastApi';
import { popErrorMessage } from '../alert/alertActions';
import { setShows, setShowsLoading } from './podcastSlice';

export default class PodcastActions {
  constructor() {
    this.podcastApi = new PodcastApi();
    autoBind(this);
  }

  getPodcasts() {
    return async (dispatch, getState) => {
      dispatch(setShowsLoading(true));

      // Fetch sensor history for display
      const response = await this.podcastApi.getPodcasts();

      response.status === 200
        ? dispatch(setShows(response.data))
        : dispatch(popErrorMessage('Failed to fetch podcasts'));

      dispatch(setShowsLoading(false));
    };
  }
}

export const { getPodcasts } = new PodcastActions();
