import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { bucketEntries } from './journalGrouping';
import { getMoodScore } from './moodUtils';
import { MoodDot } from './MoodDot';
import { journalActions } from '../../store/journal/journalActions';

/**
 * Sidebar entry list grouped into buckets (Today, Yesterday, …).
 * Reads its data from Redux so the parent doesn't have to thread it
 * through props.
 */
function GroupedEntryList() {
  const dispatch = useDispatch();
  const entries = useSelector((s) => s.journal.entries);
  const searchValue = useSelector((s) => s.journal.ui.searchValue);
  const selectedEntryId = useSelector(
    (s) => s.journal.ui.selectedEntryId,
  );

  const groups = useMemo(
    () => bucketEntries(entries, searchValue),
    [entries, searchValue],
  );
  const [collapsed, setCollapsed] = useState({});
  const toggle = (label) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

  if (groups.length === 0) {
    return (
      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ px: 1, py: 2 }}>
        No entries yet
      </Typography>
    );
  }

  return (
    <>
      {groups.map((group) => {
        const isOpen = !collapsed[group.label];
        return (
          <Box key={group.label} sx={{ mb: 1 }}>
            <Stack
              direction='row'
              alignItems='center'
              onClick={() => toggle(group.label)}
              sx={{
                px: 1,
                py: 0.5,
                cursor: 'pointer',
                userSelect: 'none',
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}>
              {isOpen ? (
                <ExpandLess
                  fontSize='small'
                  sx={{ mr: 0.5, color: 'text.secondary' }}
                />
              ) : (
                <ExpandMore
                  fontSize='small'
                  sx={{ mr: 0.5, color: 'text.secondary' }}
                />
              )}
              <Typography
                variant='overline'
                color='text.secondary'
                fontWeight={700}
                sx={{ lineHeight: 1.5 }}>
                {group.label}
              </Typography>
              <Typography
                variant='caption'
                color='text.disabled'
                sx={{ ml: 1 }}>
                {group.entries.length}
              </Typography>
            </Stack>

            <Collapse in={isOpen} unmountOnExit>
              <List disablePadding>
                {group.entries.map((entry) => {
                  const score = getMoodScore(entry);
                  const isSelected = entry.id === selectedEntryId;
                  return (
                    <ListItemButton
                      key={entry.id || `${entry.date}-${entry.title}`}
                      selected={isSelected}
                      onClick={() =>
                        dispatch(journalActions.selectEntry(entry.id))
                      }
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        alignItems: 'flex-start',
                        borderLeft: 3,
                        borderColor: isSelected
                          ? 'primary.main'
                          : 'transparent',
                      }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            noWrap>
                            {entry.time}
                          </Typography>
                        }
                        secondary={
                          <Stack
                            direction='row'
                            alignItems='center'
                            justifyContent='space-between'
                            mt={0.5}>
                            <Stack
                              direction='row'
                              alignItems='center'
                              sx={{ minWidth: 0, flex: 1 }}>
                              {score !== null && (
                                <MoodDot score={score} />
                              )}
                              <Typography
                                variant='body2'
                                color='text.primary'
                                fontWeight={600}
                                noWrap
                                sx={{
                                  ml: score !== null ? 0.75 : 0,
                                }}>
                                {entry.title}
                              </Typography>
                            </Stack>
                            {entry.date && (
                              <Typography
                                variant='caption'
                                color='text.secondary'
                                noWrap
                                sx={{ ml: 1, flexShrink: 0 }}>
                                {entry.date}
                                {entry.time ? ` · ${entry.time}` : ''}
                              </Typography>
                            )}
                          </Stack>
                        }
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          </Box>
        );
      })}
    </>
  );
}

export { GroupedEntryList };
