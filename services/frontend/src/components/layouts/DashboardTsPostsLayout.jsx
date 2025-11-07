import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../store/tsPosts/tsPostsActions';
import Spinner from '../Spinner';
import { TsPostsList } from '../tsPosts/TsPostsList';
import { TsPostDetail } from '../tsPosts/TsPostDetail';

const DashboardTsPostsLayout = () => {
  const {
    postsLoading = true,
    posts = [],
    selectedPost = null,
    selectedPostLoading = false,
  } = useSelector((x) => x.tsPosts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <Container maxWidth='xl'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h4' gutterBottom>
            TS Posts & AI Analysis
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Explore stored TS posts and their AI-powered analysis
          </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ height: '75vh', overflow: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant='h6' gutterBottom>
                Posts ({posts.length})
              </Typography>
            </Box>
            {postsLoading ? (
              <Spinner />
            ) : (
              <TsPostsList posts={posts} />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper sx={{ height: '75vh', overflow: 'auto', p: 2 }}>
            <TsPostDetail
              post={selectedPost}
              loading={selectedPostLoading}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export { DashboardTsPostsLayout };
