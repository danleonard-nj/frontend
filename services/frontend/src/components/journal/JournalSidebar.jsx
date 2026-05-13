import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add,
  Close,
  GraphicEq,
  Search,
  Settings,
  Tune,
} from '@mui/icons-material';
import { GroupedEntryList } from './GroupedEntryList';
import { journalActions } from '../../store/journal/journalActions';
import { setSearchValue } from '../../store/journal/journalSlice';

/**
 * Sidebar shown on the Journal tab.  Composes the search field,
 * grouped entry list, and the "New entry" / settings footer.
 */
function JournalSidebar() {
  const dispatch = useDispatch();
  const searchValue = useSelector((s) => s.journal.ui.searchValue);

  return (
    <Card
      variant='outlined'
      sx={{
        height: '100%',
        minHeight: 720,
        bgcolor: 'background.paper',
      }}>
      <CardContent sx={{ p: 0, height: '100%' }}>
        <Stack sx={{ height: '100%' }}>
          <Box sx={{ p: 2.5, pb: 2 }}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              mb={3}>
              <Box>
                <Typography variant='h5' fontWeight={700}>
                  Journal
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  voice-first entries
                </Typography>
              </Box>
            </Stack>

            <TextField
              size='small'
              placeholder='Search entries'
              fullWidth
              value={searchValue}
              onChange={(event) =>
                dispatch(setSearchValue(event.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search fontSize='small' />
                  </InputAdornment>
                ),
                endAdornment: searchValue ? (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='Clear search'
                      size='small'
                      onClick={() => dispatch(setSearchValue(''))}>
                      <Close fontSize='small' />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>

          <Box sx={{ px: 1.5, pb: 1.5, flex: 1, overflowY: 'auto' }}>
            <GroupedEntryList />
          </Box>

          <Box
            sx={{
              p: 2.5,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}>
            <Button
              variant='outlined'
              startIcon={<Add />}
              fullWidth
              onClick={() => dispatch(journalActions.startNewDraft())}
              sx={{ mb: 2 }}>
              New entry
            </Button>

            <Stack direction='row' justifyContent='space-between'>
              <IconButton aria-label='Settings'>
                <Settings />
              </IconButton>
              <IconButton aria-label='Audio settings'>
                <GraphicEq />
              </IconButton>
              <IconButton aria-label='Display options'>
                <Tune />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export { JournalSidebar };
