import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import Spinner from '../Spinner';

const TsPostDetail = ({ post, loading }) => {
  if (loading) {
    return <Spinner />;
  }

  if (!post) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='body1' color='text.secondary'>
          Select a post to view details
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Handle Unix timestamp (if it's a number)
      if (typeof dateString === 'number') {
        return new Date(dateString * 1000).toLocaleString();
      }
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const hasAiAnalysis = post.ai_summary || post.ai_model;

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {/* Original Post */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography
            variant='caption'
            color='text.secondary'
            gutterBottom
            display='block'>
            Published:{' '}
            {formatDate(
              post.published_timestamp ||
                post.created_at ||
                post.timestamp
            )}
          </Typography>
          {post.link && (
            <Typography
              variant='caption'
              color='text.secondary'
              gutterBottom
              display='block'
              sx={{ mb: 1 }}>
              Link:{' '}
              <a
                href={post.link}
                target='_blank'
                rel='noopener noreferrer'>
                {post.link}
              </a>
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant='body1'
            sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
            {stripHtml(post.content) ||
              post.text ||
              post.title ||
              'No content available'}
          </Typography>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      {hasAiAnalysis && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              AI Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography
              variant='body1'
              sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
              {post.ai_summary || 'No summary available'}
            </Typography>

            {/* AI Analysis Metadata */}
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant='subtitle2' gutterBottom>
                Analysis Details
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {post.ai_model && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='caption'
                      color='text.secondary'>
                      Model
                    </Typography>
                    <Typography variant='body2'>
                      {post.ai_model}
                    </Typography>
                  </Grid>
                )}
                {post.ai_tokens_used && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='caption'
                      color='text.secondary'>
                      Tokens Used
                    </Typography>
                    <Typography variant='body2'>
                      {post.ai_tokens_used.toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                {post.ai_generation_time_seconds && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='caption'
                      color='text.secondary'>
                      Generation Time
                    </Typography>
                    <Typography variant='body2'>
                      {post.ai_generation_time_seconds.toFixed(2)}s
                    </Typography>
                  </Grid>
                )}
                {post.updated_at && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='caption'
                      color='text.secondary'>
                      Last Updated
                    </Typography>
                    <Typography variant='body2'>
                      {formatDate(post.updated_at)}
                    </Typography>
                  </Grid>
                )}
                {post.is_repost !== undefined && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='caption'
                      color='text.secondary'>
                      Repost
                    </Typography>
                    <Typography variant='body2'>
                      {post.is_repost ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Additional Post Metadata */}
      {post._id && (
        <Card>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='caption' color='text.secondary'>
                  MongoDB ID
                </Typography>
                <Typography variant='body2'>{post._id}</Typography>
              </Grid>
              {post.original_link &&
                post.original_link !== post.link && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='caption'
                      color='text.secondary'>
                      Original Link
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ wordBreak: 'break-all' }}>
                      <a
                        href={post.original_link}
                        target='_blank'
                        rel='noopener noreferrer'>
                        {post.original_link}
                      </a>
                    </Typography>
                  </Grid>
                )}
              {post.created_at && (
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant='caption'
                    color='text.secondary'>
                    Created At
                  </Typography>
                  <Typography variant='body2'>
                    {formatDate(post.created_at)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export { TsPostDetail };
