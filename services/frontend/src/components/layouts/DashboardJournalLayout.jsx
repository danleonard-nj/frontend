import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, DeleteOutline } from '@mui/icons-material';
import JournalRecorder from '../journal/JournalRecorder';
import JournalAnalysisCard from '../journal/JournalAnalysisCard';
import TagsEditor from '../journal/TagsEditor';
import AttachmentStager from '../journal/AttachmentStager';
import JournalAttachments from '../journal/JournalAttachments';
import { JournalSidebar } from '../journal/JournalSidebar';
import { TranscriptCard } from '../journal/TranscriptCard';
import { EntryHeader } from '../journal/EntryHeader';
import { InsightsPanel } from '../journal/InsightsPanel';
import { NEW_ENTRY_TITLE } from '../journal/journalConstants';
import { journalActions } from '../../store/journal/journalActions';
import {
  JOURNAL_TAB,
  appendDraftSegment,
  popDraftSegment,
  setActiveTab,
  setConfirmDeleteOpen,
  setStagedAttachments,
  setTitleOverride,
  setTranscriptOverride,
} from '../../store/journal/journalSlice';

/**
 * Top-level Journal layout.  This shell only orchestrates the three
 * tabs and the delete-confirm dialog; everything else lives in
 * `src/components/journal/` and reads from the journal slice.
 */
const DashboardJournalLayout = () => {
  const dispatch = useDispatch();

  // ── Redux: domain ─────────────────────────────────────────────────────
  const committing = useSelector((s) => s.journal.committing);
  const commitError = useSelector((s) => s.journal.commitError);
  const selectedEntry = useSelector((s) => {
    const id = s.journal.ui.selectedEntryId;
    return id
      ? s.journal.entries.find((e) => e.id === id) || null
      : null;
  });

  // ── Redux: UI ─────────────────────────────────────────────────────────
  const activeTab = useSelector((s) => s.journal.ui.activeTab);
  const confirmDeleteOpen = useSelector(
    (s) => s.journal.ui.confirmDeleteOpen,
  );
  const committedEntryId = useSelector(
    (s) => s.journal.ui.committedEntryId,
  );
  const polishedEntryId = useSelector(
    (s) => s.journal.ui.polishedEntryId,
  );
  const insightsDaysBack = useSelector(
    (s) => s.journal.ui.insightsDaysBack,
  );

  // ── Redux: draft ──────────────────────────────────────────────────────
  const draftSegments = useSelector((s) => s.journal.draft.segments);
  const draftCommitted = useSelector(
    (s) => s.journal.draft.committed,
  );
  const titleOverride = useSelector(
    (s) => s.journal.draft.titleOverride,
  );
  const transcriptOverride = useSelector(
    (s) => s.journal.draft.transcriptOverride,
  );
  const stagedAttachments = useSelector(
    (s) => s.journal.draft.stagedAttachments,
  );

  // ── Derived values ────────────────────────────────────────────────────
  const transcript = useMemo(() => {
    if (transcriptOverride !== null) return transcriptOverride;
    if (selectedEntry) {
      return (
        selectedEntry.cleanedTranscript ||
        selectedEntry.rawTranscript ||
        ''
      );
    }
    return draftSegments.map((s) => s.transcript).join('\n\n');
  }, [transcriptOverride, draftSegments, selectedEntry]);

  const recordedAt = selectedEntry
    ? selectedEntry.createdAt
    : draftSegments[0]?.started_at || null;

  const displayTitle =
    titleOverride !== null
      ? titleOverride
      : selectedEntry?.title || NEW_ENTRY_TITLE;

  const savedTitle = selectedEntry?.title || NEW_ENTRY_TITLE;

  const headerDate = useMemo(() => {
    const source = recordedAt || new Date().toISOString();
    return new Date(source).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [recordedAt]);

  // ── Effects ───────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(journalActions.loadEntries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(journalActions.loadInsights(insightsDaysBack));
  }, [dispatch, insightsDaysBack]);

  // ── Render helpers ────────────────────────────────────────────────────
  const writeTabActions = (
    <Button
      variant='outlined'
      startIcon={<Add />}
      onClick={() => dispatch(journalActions.startNewDraft())}>
      New Entry
    </Button>
  );

  const journalEntryActions = (
    <Tooltip title='Delete entry'>
      <IconButton
        size='small'
        color='error'
        aria-label='Delete entry'
        onClick={() => dispatch(setConfirmDeleteOpen(true))}>
        <DeleteOutline fontSize='small' />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => {
          // Switching to the Write tab should always present a fresh
          // draft.  If a saved entry is selected (e.g. just committed),
          // start a new draft so the Write tab doesn't show old content.
          if (v === JOURNAL_TAB.WRITE && selectedEntry) {
            dispatch(journalActions.startNewDraft());
          } else {
            dispatch(setActiveTab(v));
          }
        }}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label='Write' value={JOURNAL_TAB.WRITE} />
        <Tab label='Journal' value={JOURNAL_TAB.JOURNAL} />
        <Tab label='Insights' value={JOURNAL_TAB.INSIGHTS} />
      </Tabs>

      {activeTab === JOURNAL_TAB.WRITE && (
        <Stack spacing={3}>
          <Box>
            <EntryHeader
              title={displayTitle}
              savedTitle={savedTitle}
              onTitleChange={(v) => dispatch(setTitleOverride(v))}
              onTitleSave={() => {
                /* Drafts: title is sent on commit. No-op here. */
              }}
              headerDate={headerDate}
              actions={writeTabActions}
              canBeDirty={false}
            />
            {commitError && (
              <Typography
                variant='caption'
                color='error'
                sx={{ display: 'block', mt: 1 }}>
                {commitError}
              </Typography>
            )}
          </Box>

          <JournalRecorder
            onTranscriptReady={(text, meta) => {
              dispatch(
                appendDraftSegment({
                  clip_id: meta?.clip_id || null,
                  started_at:
                    meta?.started_at || new Date().toISOString(),
                  duration_seconds: meta?.duration_seconds ?? null,
                  transcript: text,
                }),
              );
            }}
          />

          <TranscriptCard
            transcript={transcript}
            committed={draftCommitted}
            committing={committing}
            onCommit={() => dispatch(journalActions.commitDraft())}
            recordedAt={recordedAt}
            isEditable={!draftCommitted}
            onEdit={(text) => dispatch(setTranscriptOverride(text))}
            onUndo={() => dispatch(popDraftSegment())}
            canUndo={draftSegments.length > 0 && !draftCommitted}
          />

          <AttachmentStager
            files={stagedAttachments}
            onChange={(files) =>
              dispatch(setStagedAttachments(files))
            }
            disabled={committing || draftCommitted}
          />

          {committedEntryId && (
            <JournalAnalysisCard
              entryId={committedEntryId}
              variant='compact'
            />
          )}
        </Stack>
      )}

      {activeTab === JOURNAL_TAB.JOURNAL && (
        <Grid container spacing={3} alignItems='stretch'>
          <Grid item xs={12} md={4}>
            <JournalSidebar />
          </Grid>

          <Grid item xs={12} md={8}>
            {selectedEntry ? (
              <Stack spacing={3}>
                <EntryHeader
                  title={displayTitle}
                  savedTitle={savedTitle}
                  onTitleChange={(v) => dispatch(setTitleOverride(v))}
                  onTitleSave={(newTitle) =>
                    dispatch(
                      journalActions.patchEntryTitle(
                        selectedEntry.id,
                        newTitle,
                      ),
                    )
                  }
                  headerDate={headerDate}
                  actions={journalEntryActions}
                />

                <TranscriptCard
                  transcript={transcript}
                  committed
                  committing={false}
                  onCommit={() => {}}
                  recordedAt={recordedAt}
                  isEditable
                  onEdit={(text) =>
                    dispatch(
                      journalActions.patchEntryTranscript(
                        selectedEntry.id,
                        text,
                      ),
                    )
                  }
                  onPolish={(modes) =>
                    dispatch(
                      journalActions.polishEntry(
                        selectedEntry.id,
                        modes,
                      ),
                    )
                  }
                  onUndoPolish={() =>
                    dispatch(
                      journalActions.undoPolishEntry(
                        selectedEntry.id,
                      ),
                    )
                  }
                  canUndoPolish={
                    polishedEntryId === selectedEntry.id ||
                    Boolean(selectedEntry.pre_polish_transcript)
                  }
                />

                <TagsEditor
                  entryId={selectedEntry.id}
                  tags={selectedEntry.tags}
                />

                <JournalAttachments entryId={selectedEntry.id} />

                <JournalAnalysisCard
                  entryId={selectedEntry.id}
                  variant='detail'
                />
              </Stack>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 400,
                }}>
                <Typography color='text.secondary'>
                  Select an entry to view
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      )}

      {activeTab === JOURNAL_TAB.INSIGHTS && <InsightsPanel />}

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => dispatch(setConfirmDeleteOpen(false))}>
        <DialogTitle>Delete entry?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete{' '}
            <strong>{selectedEntry?.title || 'this entry'}</strong>.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dispatch(setConfirmDeleteOpen(false))}>
            Cancel
          </Button>
          <Button
            color='error'
            variant='contained'
            onClick={() => {
              if (selectedEntry) {
                dispatch(
                  journalActions.deleteEntry(selectedEntry.id),
                );
              }
              dispatch(setConfirmDeleteOpen(false));
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { DashboardJournalLayout };
