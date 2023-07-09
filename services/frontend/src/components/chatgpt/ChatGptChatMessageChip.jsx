import { Chip, styled } from '@mui/material';

const ChatMessageChip = styled(Chip)(({ theme }) => ({
  padding: theme.spacing(1),
  height: '100%',
  '& .MuiChip-label': {
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    textOverflow: 'clip',
  },
}));

export { ChatMessageChip };
