import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../store/tsPosts/tsPostsActions';
import {
  setLimit,
  setStartTimestamp,
  setEndTimestamp,
} from '../../store/tsPosts/tsPostsSlice';
import Spinner from '../Spinner';
import { TsPostsList } from '../tsPosts/TsPostsList';
import { TsPostDetail } from '../tsPosts/TsPostDetail';

const DashboardTsPostsLayout = () => {
  const {
    postsLoading = true,
    posts = [],
    selectedPost = null,
    selectedPostLoading = false,
    limit = 10,
  } = useSelector((x) => x.tsPosts);

  const dispatch = useDispatch();
  const [localLimit, setLocalLimit] = useState(limit);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleApplyFilters = () => {
    // Convert dates to Unix timestamps if provided
    const startTimestamp = startDate
      ? Math.floor(new Date(startDate).getTime() / 1000)
      : null;
    const endTimestamp = endDate
      ? Math.floor(new Date(endDate).getTime() / 1000)
      : null;

    dispatch(setLimit(localLimit));
    dispatch(setStartTimestamp(startTimestamp));
    dispatch(setEndTimestamp(endTimestamp));
    dispatch(getPosts());
  };

  const handleReset = () => {
    setLocalLimit(10);
    setStartDate('');
    setEndDate('');
    dispatch(setLimit(10));
    dispatch(setStartTimestamp(null));
    dispatch(setEndTimestamp(null));
    dispatch(getPosts());
  };

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

        {/* Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  label='Number of Posts'
                  value={localLimit}
                  onChange={(e) =>
                    setLocalLimit(Number(e.target.value))
                  }
                  size='small'>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type='date'
                  label='Start Date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type='date'
                  label='End Date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant='contained'
                  onClick={handleApplyFilters}
                  disabled={postsLoading}>
                  Apply
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant='outlined'
                  onClick={handleReset}
                  disabled={postsLoading}>
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ height: '65vh', overflow: 'auto' }}>
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
          <Paper sx={{ height: '65vh', overflow: 'auto', p: 2 }}>
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
