import autoBind from 'auto-bind';
import TsPostsApi from '../../api/tsPostsApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setPosts,
  setPostsLoading,
  setSelectedPost,
  setSelectedPostLoading,
  setLimit,
  setStartTimestamp,
  setEndTimestamp,
} from './tsPostsSlice';

export default class TsPostsActions {
  constructor() {
    this.tsPostsApi = new TsPostsApi();
    autoBind(this);
  }

  getPosts() {
    return async (dispatch, getState) => {
      const state = getState();
      const { limit, startTimestamp, endTimestamp } = state.tsPosts;

      dispatch(setPostsLoading(true));

      const response = await this.tsPostsApi.getPosts(
        limit,
        startTimestamp,
        endTimestamp
      );

      if (response.status === 200) {
        // Extract posts array from response data
        const posts = response.data?.posts || [];
        dispatch(setPosts(posts));
      } else {
        dispatch(popErrorMessage('Failed to fetch TS posts'));
      }

      dispatch(setPostsLoading(false));
    };
  }

  getPost(postId) {
    return async (dispatch, getState) => {
      dispatch(setSelectedPostLoading(true));

      const response = await this.tsPostsApi.getPost(postId);

      if (response.status === 200) {
        // Extract post object from response data
        const post = response.data?.post || null;
        dispatch(setSelectedPost(post));
      } else {
        dispatch(popErrorMessage('Failed to fetch TS post details'));
      }

      dispatch(setSelectedPostLoading(false));
    };
  }

  clearSelectedPost() {
    return (dispatch) => {
      dispatch(setSelectedPost(null));
    };
  }
}

export const { getPosts, getPost, clearSelectedPost } =
  new TsPostsActions();
