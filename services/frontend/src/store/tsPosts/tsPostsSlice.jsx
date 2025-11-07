import { createSlice } from '@reduxjs/toolkit';

const tsPostsInitialState = {
  posts: [],
  postsLoading: true,
  selectedPost: null,
  selectedPostLoading: false,
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
  },
});

export const {
  setPosts,
  setPostsLoading,
  setSelectedPost,
  setSelectedPostLoading,
} = tsPostsSlice.actions;

export default tsPostsSlice.reducer;
