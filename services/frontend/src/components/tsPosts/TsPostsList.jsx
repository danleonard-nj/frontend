import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getPost } from '../../store/tsPosts/tsPostsActions';

const TsPostsList = ({ posts }) => {
  const { selectedPost } = useSelector((x) => x.tsPosts);
  const dispatch = useDispatch();

  const handleSelectPost = (post) => {
    dispatch(getPost(post._id));
  };

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

  return (
    <List>
      {posts.map((post, index) => (
        <Box key={post._id || post.id || post.post_id || index}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleSelectPost(post)}
              selected={
                selectedPost &&
                (selectedPost._id === post._id ||
                  selectedPost.id === post.id ||
                  selectedPost.post_id === post.post_id)
              }>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Typography variant='body1' noWrap>
                      {post.title ||
                        `Post #${
                          post._id || post.id || post.post_id
                        }`}
                    </Typography>
                    {(post.ai_summary || post.ai_analysis) && (
                      <Chip
                        label='AI Analyzed'
                        color='success'
                        size='small'
                        sx={{ ml: 1, flexShrink: 0 }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant='caption' display='block'>
                      {formatDate(
                        post.published_timestamp ||
                          post.created_at ||
                          post.timestamp
                      )}
                    </Typography>
                    {(post.ai_summary || post.content) && (
                      <Typography
                        variant='body2'
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mt: 0.5,
                        }}>
                        {stripHtml(
                          post.ai_summary || post.content || post.text
                        )}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
          {index < posts.length - 1 && <Divider />}
        </Box>
      ))}
    </List>
  );
};

export { TsPostsList };
