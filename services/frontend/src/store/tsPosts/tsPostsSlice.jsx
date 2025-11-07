import { createSlice } from '@reduxjs/toolkit';

const tsPostsInitialState = {
  posts: [],
  postsLoading: true,
  selectedPost: null,
  selectedPostLoading: false,
  limit: 10,
  startTimestamp: null,
  endTimestamp: null,
};

const tsPostsSlice = createSlice({
  name: 'tsPosts',
  initialState: tsPostsInitialState,
  reducers: {
    setPosts(state, { payload }) {
      state.posts = payload;
    },
    setPostsLoading(state, { payload }) {
      state.postsLoading = payload;
    },
    setSelectedPost(state, { payload }) {
      state.selectedPost = payload;
    },
    setSelectedPostLoading(state, { payload }) {
      state.selectedPostLoading = payload;
    },
    setLimit(state, { payload }) {
      state.limit = payload;
    },
    setStartTimestamp(state, { payload }) {
      state.startTimestamp = payload;
    },
    setEndTimestamp(state, { payload }) {
      state.endTimestamp = payload;
    },
  },
});

export const {
  setPosts,
  setPostsLoading,
  setSelectedPost,
  setSelectedPostLoading,
  setLimit,
  setStartTimestamp,
  setEndTimestamp,
} = tsPostsSlice.actions;

export default tsPostsSlice.reducer;
