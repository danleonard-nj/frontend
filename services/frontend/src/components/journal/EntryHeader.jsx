import React from 'react';
import {
  Box,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FiberManualRecord, MenuBook } from '@mui/icons-material';

/**
 * Editable title row with unsaved-changes dot indicator.
 * Shows an amber dot when the user has typed a change not yet saved
 * to the API.  For drafts (`canBeDirty=false`), the title goes along
 * with the commit payload so the dirty concept doesn't apply.
 */
function EntryHeader({
  title,
  savedTitle,
  onTitleChange,
  onTitleSave,
  headerDate,
  actions,
  canBeDirty = true,
}) {
  const isDirty = canBeDirty && title !== savedTitle;

  return (
    <Box>
      <Stack direction='row' spacing={1} alignItems='center' mb={1}>
        <MenuBook color='primary' fontSize='small' />
        <Typography color='primary' fontWeight={700}>
          {headerDate}
        </Typography>
        {isDirty && (
          <Tooltip title='Unsaved title — press Enter or click away to save'>
            <FiberManualRecord
              sx={{ fontSize: 10, color: 'warning.main', ml: 0.5 }}
            />
          </Tooltip>
        )}
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}>
        <TextField
          variant='standard'
          fullWidth
          value={title}
          placeholder='New entry'
          onChange={(e) => onTitleChange(e.target.value)}
          onBlur={() => isDirty && onTitleSave(title)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (isDirty) onTitleSave(title);
            }
          }}
          InputProps={{
            disableUnderline: !isDirty,
            sx: {
              fontSize: (theme) => theme.typography.h3.fontSize,
              fontWeight: 700,
            },
          }}
        />
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          flexShrink={0}>
          {actions}
        </Stack>
      </Stack>
    </Box>
  );
}

export { EntryHeader };
