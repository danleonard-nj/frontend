import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import {
  AttachFile,
  Download,
  DeleteOutline,
  Refresh,
  ErrorOutline,
  Close,
} from '@mui/icons-material';
import { popErrorMessage } from '../../store/alert/alertActions';
import {
  ATTACHMENT_MAX_BYTES,
  journalActions,
} from '../../store/journal/journalActions';

const EMPTY = { items: [], pending: [], loading: false, error: null };

function formatBytes(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '';
  }
}

const JournalAttachments = ({ entryId }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const att = useSelector(
    (s) => s.journal.attachments?.[entryId] || EMPTY,
  );
  const { items, pending, loading, error } = att;

  useEffect(() => {
    if (entryId) {
      dispatch(journalActions.loadAttachments(entryId));
    }
  }, [dispatch, entryId]);

  const handlePick = useCallback(
    (e) => {
      const picked = Array.from(e.target.files || []);
      e.target.value = '';
      if (!entryId || picked.length === 0) return;
      for (const f of picked) {
        if (f.size > ATTACHMENT_MAX_BYTES) {
          dispatch(
            popErrorMessage(
              `${f.name} exceeds the 5 MB attachment limit`,
            ),
          );
          continue;
        }
        dispatch(journalActions.uploadAttachment(entryId, f));
      }
    },
    [dispatch, entryId],
  );

  const handleDelete = useCallback(
    (attachmentId) => {
      dispatch(
        journalActions.deleteAttachment(entryId, attachmentId),
      );
    },
    [dispatch, entryId],
  );

  const handleRetry = useCallback(
    (tempId) => {
      dispatch(journalActions.retryAttachmentUpload(entryId, tempId));
    },
    [dispatch, entryId],
  );

  const handleDismiss = useCallback(
    (tempId) => {
      dispatch(
        journalActions.dismissFailedAttachment(entryId, tempId),
      );
    },
    [dispatch, entryId],
  );

  const handleDownload = useCallback(
    (attachment) => {
      dispatch(
        journalActions.downloadAttachment(entryId, attachment),
      );
    },
    [dispatch, entryId],
  );

  const total = (items?.length || 0) + (pending?.length || 0);

  return (
    <Card variant='outlined'>
      <CardContent>
        <input
          ref={inputRef}
          type='file'
          multiple
          hidden
          onChange={handlePick}
        />
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={1}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <AttachFile fontSize='small' color='action' />
            <Typography
              variant='overline'
              color='text.secondary'
              fontWeight={700}>
              Attachments ({total})
            </Typography>
            {loading && <CircularProgress size={14} />}
          </Stack>
          <Button
            size='small'
            variant='outlined'
            startIcon={<AttachFile />}
            onClick={() => inputRef.current?.click()}>
            Add files
          </Button>
        </Stack>

        {error && (
          <Typography variant='caption' color='error'>
            {error}
          </Typography>
        )}

        {total === 0 && !loading && (
          <Typography variant='body2' color='text.secondary'>
            No attachments yet. Max 5 MB per file.
          </Typography>
        )}

        {total > 0 && (
          <List dense disablePadding>
            {items.map((a) => {
              const aid = a.attachment_id || a.id || a.attachmentId;
              const meta = [
                a.content_type || a.contentType,
                formatBytes(a.size ?? a.bytes),
                formatDate(a.uploaded_at || a.uploadedAt),
              ]
                .filter(Boolean)
                .join(' \u00b7 ');
              return (
                <ListItem
                  key={aid}
                  disableGutters
                  secondaryAction={
                    <Stack direction='row' spacing={0.5}>
                      <Tooltip title='Download'>
                        <IconButton
                          size='small'
                          onClick={() => handleDownload(a)}>
                          <Download fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => handleDelete(aid)}>
                          <DeleteOutline fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }>
                  <ListItemText
                    primary={a.filename || a.name || 'attachment'}
                    secondary={meta}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              );
            })}

            {pending.map((p) => (
              <ListItem
                key={p.tempId}
                disableGutters
                secondaryAction={
                  p.status === 'failed' ? (
                    <Stack direction='row' spacing={0.5}>
                      <Tooltip title='Retry upload'>
                        <IconButton
                          size='small'
                          onClick={() => handleRetry(p.tempId)}>
                          <Refresh fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Dismiss'>
                        <IconButton
                          size='small'
                          onClick={() => handleDismiss(p.tempId)}>
                          <Close fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : (
                    <CircularProgress size={16} />
                  )
                }>
                <ListItemText
                  primary={
                    <Stack
                      direction='row'
                      spacing={1}
                      alignItems='center'>
                      <Typography variant='body2'>
                        {p.filename}
                      </Typography>
                      {p.status === 'failed' ? (
                        <Chip
                          size='small'
                          color='error'
                          variant='outlined'
                          icon={<ErrorOutline />}
                          label='Failed'
                        />
                      ) : (
                        <Chip
                          size='small'
                          variant='outlined'
                          label='Uploading\u2026'
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    p.status === 'failed' && p.error
                      ? p.error
                      : formatBytes(p.size)
                  }
                  secondaryTypographyProps={{
                    variant: 'caption',
                    color:
                      p.status === 'failed'
                        ? 'error'
                        : 'text.secondary',
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalAttachments;
