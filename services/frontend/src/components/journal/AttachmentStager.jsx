import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { AttachFile, Close } from '@mui/icons-material';
import { popErrorMessage } from '../../store/alert/alertActions';
import { ATTACHMENT_MAX_BYTES } from '../../store/journal/journalActions';

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const AttachmentStager = ({ files, onChange, disabled = false }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const handleSelect = useCallback(
    (e) => {
      const picked = Array.from(e.target.files || []);
      if (picked.length === 0) return;

      const accepted = [];
      for (const f of picked) {
        if (f.size > ATTACHMENT_MAX_BYTES) {
          dispatch(
            popErrorMessage(
              `${f.name} exceeds the 5 MB attachment limit`,
            ),
          );
          continue;
        }
        accepted.push(f);
      }
      if (accepted.length > 0) {
        onChange([...(files || []), ...accepted]);
      }
      // Reset input so picking the same file again still triggers change
      e.target.value = '';
    },
    [dispatch, files, onChange],
  );

  const handleRemove = useCallback(
    (index) => {
      const next = files.slice();
      next.splice(index, 1);
      onChange(next);
    },
    [files, onChange],
  );

  return (
    <Box>
      <input
        ref={inputRef}
        type='file'
        multiple
        hidden
        onChange={handleSelect}
      />
      <Stack direction='row' spacing={1} alignItems='center' mb={1}>
        <Button
          variant='outlined'
          size='small'
          startIcon={<AttachFile />}
          onClick={() => inputRef.current?.click()}
          disabled={disabled}>
          Add attachments
        </Button>
        <Typography variant='caption' color='text.secondary'>
          Max 5 MB per file. Uploads start after you save the entry.
        </Typography>
      </Stack>

      {files && files.length > 0 && (
        <Stack
          direction='row'
          spacing={1}
          flexWrap='wrap'
          useFlexGap
          sx={{ rowGap: 1 }}>
          {files.map((f, i) => (
            <Chip
              key={`${f.name}-${i}`}
              label={`${f.name} \u00b7 ${formatBytes(f.size)}`}
              onDelete={disabled ? undefined : () => handleRemove(i)}
              deleteIcon={<Close />}
              variant='outlined'
              size='small'
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default AttachmentStager;
