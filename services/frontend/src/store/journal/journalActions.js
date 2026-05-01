import autoBind from 'auto-bind';
import JournalApi from '../../api/journalApi';
import SpeechToTextApi from '../../api/speechToTextApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setEntriesLoading,
  setEntries,
  prependEntry,
  updateEntry,
  removeEntry,
  setInsightsLoading,
  setInsights,
  setInsightsError,
  setCommitting,
  setCommitError,
  setEntryDetailLoading,
  setEntryDetail,
  setEntryDetailError,
  setEntryDetailProcessing,
  clearEntryDetail,
  setTagsLoading,
  setTags,
  mergeTags,
  setAttachmentsLoading,
  setAttachments,
  setAttachmentsError,
  addPendingAttachment,
  updatePendingAttachment,
  removePendingAttachment,
  addAttachment,
  removeAttachment,
} from './journalSlice';

export const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function makeTempId() {
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function moodFromAnalysis(analysis) {
  const label = analysis?.mood?.label;
  if (!label) return 'neutral';
  const normalized = label.toLowerCase();
  if (
    [
      'good',
      'great',
      'positive',
      'happy',
      'calm',
      'grateful',
    ].includes(normalized)
  )
    return 'good';
  if (
    ['low', 'sad', 'anxious', 'stressed', 'angry', 'down'].includes(
      normalized,
    )
  )
    return 'low';
  return 'neutral';
}

// Server emits ISO timestamps in UTC but sometimes without a trailing 'Z'
// (e.g. "2026-04-30T16:06:30.160000"). JS's Date parser treats those naive
// strings as local time, which makes everything appear shifted by the user's
// UTC offset. Normalize by appending 'Z' when no explicit offset is present.
export function normalizeUtcTimestamp(value) {
  if (!value || typeof value !== 'string') return value;
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(value)) return value;
  return `${value}Z`;
}

export function entryFromApi(raw) {
  if (!raw) return null;
  const createdAt = normalizeUtcTimestamp(
    raw.created_at || raw.createdAt || null,
  );
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : '';
  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';
  return {
    id: raw.entry_id || raw.entryId || raw.id || null,
    title: raw.title || 'New entry',
    rawTranscript: raw.raw_transcript || raw.rawTranscript || '',
    cleanedTranscript:
      raw.cleaned_transcript || raw.cleanedTranscript || null,
    segments: Array.isArray(raw.segments) ? raw.segments : [],
    source: raw.source || 'voice',
    status: raw.status || 'created',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    createdAt,
    date,
    time,
    mood: moodFromAnalysis(raw.analysis),
  };
}

export default class JournalActions {
  constructor() {
    this.journalApi = new JournalApi();
    this.speechToTextApi = new SpeechToTextApi();
    autoBind(this);
  }

  loadEntries(limit = 50) {
    return async (dispatch) => {
      dispatch(setEntriesLoading(true));
      try {
        const response = await this.journalApi.listEntries(limit);
        if (response.status === 200) {
          const list = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.entries)
              ? response.data.entries
              : [];
          dispatch(
            setEntries(list.map(entryFromApi).filter(Boolean)),
          );
        } else {
          dispatch(popErrorMessage('Failed to load journal entries'));
          dispatch(setEntriesLoading(false));
        }
      } catch {
        dispatch(popErrorMessage('Failed to load journal entries'));
        dispatch(setEntriesLoading(false));
      }
    };
  }

  loadInsights(days = 14) {
    return async (dispatch) => {
      dispatch(setInsightsLoading(true));
      try {
        const response = await this.journalApi.getInsights(days);
        if (response.status === 200) {
          dispatch(setInsights(response.data));
        } else {
          dispatch(
            setInsightsError(
              `Failed to load insights (${response.status})`,
            ),
          );
        }
      } catch (err) {
        dispatch(
          setInsightsError(err.message || 'Failed to load insights'),
        );
      }
    };
  }

  commitEntry(payload) {
    return async (dispatch) => {
      dispatch(setCommitting(true));
      dispatch(setCommitError(null));
      try {
        const response = await this.journalApi.createEntry(payload);
        if (response.status === 201 || response.status === 200) {
          const created = entryFromApi(response.data);
          if (created) dispatch(prependEntry(created));
          dispatch(setCommitting(false));
          dispatch(this.loadInsights());
          return created;
        } else {
          dispatch(
            setCommitError(`Commit failed (${response.status})`),
          );
          dispatch(setCommitting(false));
          return null;
        }
      } catch (err) {
        dispatch(setCommitError(err.message || 'Commit failed'));
        dispatch(setCommitting(false));
        return null;
      }
    };
  }

  patchEntryTranscript(entryId, text) {
    return async (dispatch) => {
      try {
        await this.journalApi.patchEntry(entryId, {
          raw_transcript: text,
        });
        dispatch(
          updateEntry({
            id: entryId,
            rawTranscript: text,
            cleanedTranscript: null,
          }),
        );
        dispatch(popMessage('Entry updated'));
      } catch (err) {
        dispatch(popErrorMessage('Failed to update entry'));
      }
    };
  }

  patchEntryTitle(entryId, title) {
    return async (dispatch) => {
      try {
        await this.journalApi.patchEntry(entryId, { title });
        dispatch(updateEntry({ id: entryId, title }));
        dispatch(popMessage('Title updated'));
      } catch (err) {
        dispatch(popErrorMessage('Failed to update title'));
      }
    };
  }

  loadTags() {
    return async (dispatch) => {
      dispatch(setTagsLoading(true));
      try {
        const response = await this.journalApi.listTags();
        if (response.status === 200) {
          const list = Array.isArray(response.data?.tags)
            ? response.data.tags
            : Array.isArray(response.data)
              ? response.data
              : [];
          dispatch(setTags(list));
        } else {
          dispatch(setTagsLoading(false));
        }
      } catch (err) {
        dispatch(setTagsLoading(false));
      }
    };
  }

  patchEntryTags(entryId, tags) {
    return async (dispatch) => {
      const cleaned = Array.isArray(tags)
        ? Array.from(
            new Set(
              tags
                .map((t) => (typeof t === 'string' ? t.trim() : ''))
                .filter(Boolean),
            ),
          )
        : [];
      try {
        const response = await this.journalApi.patchEntry(entryId, {
          tags: cleaned,
        });
        if (response.status >= 200 && response.status < 300) {
          dispatch(updateEntry({ id: entryId, tags: cleaned }));
          dispatch(mergeTags(cleaned));
          return true;
        }
        dispatch(popErrorMessage('Failed to update tags'));
        return false;
      } catch (err) {
        dispatch(popErrorMessage('Failed to update tags'));
        return false;
      }
    };
  }

  deleteEntry(entryId) {
    return async (dispatch) => {
      try {
        const response = await this.journalApi.deleteEntry(entryId);
        if (
          response.status === 200 ||
          response.status === 204 ||
          response.status === 404
        ) {
          dispatch(removeEntry(entryId));
          dispatch(clearEntryDetail(entryId));
          dispatch(popMessage('Entry deleted'));
          dispatch(this.loadInsights());
          return true;
        }
        dispatch(popErrorMessage('Failed to delete entry'));
        return false;
      } catch (err) {
        dispatch(popErrorMessage('Failed to delete entry'));
        return false;
      }
    };
  }

  loadEntryDetail(entryId, { silent = false } = {}) {
    return async (dispatch) => {
      if (!entryId) return null;
      if (!silent) {
        dispatch(
          setEntryDetailLoading({ id: entryId, loading: true }),
        );
      }
      try {
        const response = await this.journalApi.getEntry(entryId);
        if (response.status === 200) {
          dispatch(
            setEntryDetail({ id: entryId, entry: response.data }),
          );
          return response.data;
        }
        if (response.status === 404) {
          dispatch(
            setEntryDetailError({
              id: entryId,
              error: 'Entry not found',
            }),
          );
          return null;
        }
        dispatch(
          setEntryDetailError({
            id: entryId,
            error: `Failed to load entry (${response.status})`,
          }),
        );
        return null;
      } catch (err) {
        dispatch(
          setEntryDetailError({
            id: entryId,
            error: err.message || 'Failed to load entry',
          }),
        );
        return null;
      }
    };
  }

  processEntryAnalysis(entryId, force = false) {
    return async (dispatch) => {
      if (!entryId) return null;
      dispatch(
        setEntryDetailProcessing({ id: entryId, processing: true }),
      );
      try {
        await this.journalApi.processEntry(entryId, force);
        const fresh = await dispatch(
          this.loadEntryDetail(entryId, { silent: true }),
        );
        return fresh;
      } catch (err) {
        dispatch(
          setEntryDetailError({
            id: entryId,
            error: err.message || 'Failed to request processing',
          }),
        );
        return null;
      } finally {
        dispatch(
          setEntryDetailProcessing({
            id: entryId,
            processing: false,
          }),
        );
      }
    };
  }

  reprocessEntryAnalysis(entryId) {
    return async (dispatch) => {
      if (!entryId) return null;
      dispatch(
        setEntryDetailProcessing({ id: entryId, processing: true }),
      );
      try {
        const response = await this.journalApi.reprocessEntry(
          entryId,
          true,
        );
        if (response.status === 202 || response.status === 200) {
          // Poll until analysis lands
          const fresh = await dispatch(
            this.loadEntryDetail(entryId, { silent: true }),
          );
          return fresh;
        }
        if (response.status === 409) {
          // Already queued — just refresh the card
          await dispatch(
            this.loadEntryDetail(entryId, { silent: true }),
          );
          return null;
        }
        dispatch(
          setEntryDetailError({
            id: entryId,
            error: `Reprocess request failed (${response.status})`,
          }),
        );
        return null;
      } catch (err) {
        dispatch(
          setEntryDetailError({
            id: entryId,
            error: err.message || 'Failed to request reprocess',
          }),
        );
        return null;
      } finally {
        dispatch(
          setEntryDetailProcessing({
            id: entryId,
            processing: false,
          }),
        );
      }
    };
  }

  polishEntry(entryId, modes) {
    return async (dispatch) => {
      try {
        const response = await this.journalApi.polishEntry(
          entryId,
          modes,
        );
        if (response.status === 200) {
          const updated = entryFromApi(response.data);
          if (updated) dispatch(updateEntry(updated));
          dispatch(popMessage('Transcript polished'));
          return updated;
        }
        dispatch(popErrorMessage('Failed to polish transcript'));
        return null;
      } catch (err) {
        dispatch(popErrorMessage('Failed to polish transcript'));
        return null;
      }
    };
  }

  undoPolishEntry(entryId) {
    return async (dispatch) => {
      try {
        const response = await this.journalApi.undoPolish(entryId);
        if (response.status === 200) {
          const updated = entryFromApi(response.data);
          if (updated) dispatch(updateEntry(updated));
          dispatch(popMessage('Polish undone'));
          return updated;
        }
        if (response.status === 404) {
          dispatch(popErrorMessage('Nothing to undo'));
          return null;
        }
        dispatch(popErrorMessage('Failed to undo polish'));
        return null;
      } catch (err) {
        dispatch(popErrorMessage('Failed to undo polish'));
        return null;
      }
    };
  }

  /**
   * Transcribe a single audio clip captured by the journal recorder.
   *
   * Kept intentionally narrow — does NOT touch the speech-to-text slice
   * used by the chat composer (which would pollute that flow with
   * journal recordings).  Returns:
   *   { text, transcriptionId } on success
   *   null                      on failure (a user-facing alert is shown)
   */
  transcribeJournalClip(audioBlob, options = {}) {
    return async (dispatch) => {
      const { provider = null } = options;
      try {
        const result = await this.speechToTextApi.transcribeAudio(
          audioBlob,
          false, // diarize
          false, // returnWaveform
          provider,
        );
        const text = (result?.text || '').trim();
        return {
          text,
          transcriptionId: result?.transcription_id || null,
        };
      } catch (err) {
        dispatch(
          popErrorMessage(err.message || 'Transcription failed'),
        );
        return null;
      }
    };
  }

  // ── Attachments ────────────────────────────────────────────────────

  loadAttachments(entryId) {
    return async (dispatch) => {
      if (!entryId) return;
      dispatch(setAttachmentsLoading({ id: entryId, loading: true }));
      try {
        const response =
          await this.journalApi.listAttachments(entryId);
        if (response.status === 200) {
          const items = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.attachments)
              ? response.data.attachments
              : [];
          dispatch(setAttachments({ id: entryId, items }));
        } else if (response.status === 404) {
          dispatch(setAttachments({ id: entryId, items: [] }));
        } else {
          dispatch(
            setAttachmentsError({
              id: entryId,
              error: `Failed to load attachments (${response.status})`,
            }),
          );
        }
      } catch (err) {
        dispatch(
          setAttachmentsError({
            id: entryId,
            error: err.message || 'Failed to load attachments',
          }),
        );
      }
    };
  }

  uploadAttachment(entryId, file, { tempId: providedTempId } = {}) {
    return async (dispatch) => {
      if (!entryId || !file) return null;

      if (file.size > ATTACHMENT_MAX_BYTES) {
        dispatch(
          popErrorMessage(
            `${file.name} exceeds the 5 MB attachment limit`,
          ),
        );
        return null;
      }

      const tempId = providedTempId || makeTempId();
      dispatch(
        addPendingAttachment({
          id: entryId,
          pending: {
            tempId,
            file,
            filename: file.name,
            size: file.size,
            contentType: file.type || 'application/octet-stream',
            status: 'uploading',
            error: null,
          },
        }),
      );

      try {
        const response = await this.journalApi.uploadAttachment(
          entryId,
          file,
        );
        if (response.isSuccess && response.data) {
          dispatch(
            addAttachment({
              id: entryId,
              attachment: response.data,
            }),
          );
          dispatch(removePendingAttachment({ id: entryId, tempId }));
          return response.data;
        }
        dispatch(
          updatePendingAttachment({
            id: entryId,
            tempId,
            changes: {
              status: 'failed',
              error:
                response.data?.error ||
                `Upload failed (${response.status})`,
            },
          }),
        );
        dispatch(
          popErrorMessage(
            `Failed to upload ${file.name} \u2014 open the entry to retry`,
          ),
        );
        return null;
      } catch (err) {
        dispatch(
          updatePendingAttachment({
            id: entryId,
            tempId,
            changes: {
              status: 'failed',
              error: err.message || 'Upload failed',
            },
          }),
        );
        dispatch(
          popErrorMessage(
            `Failed to upload ${file.name} \u2014 open the entry to retry`,
          ),
        );
        return null;
      }
    };
  }

  uploadStagedAttachments(entryId, files) {
    return async (dispatch) => {
      if (!entryId || !Array.isArray(files) || files.length === 0)
        return;
      // Fire each upload independently — don't await as a group so the
      // user isn't blocked on a slow file.
      for (const file of files) {
        dispatch(this.uploadAttachment(entryId, file));
      }
    };
  }

  retryAttachmentUpload(entryId, tempId) {
    return async (dispatch, getState) => {
      const att = getState().journal.attachments?.[entryId];
      const pending = att?.pending?.find((p) => p.tempId === tempId);
      if (!pending || !pending.file) return;
      dispatch(
        updatePendingAttachment({
          id: entryId,
          tempId,
          changes: { status: 'uploading', error: null },
        }),
      );
      dispatch(
        this.uploadAttachment(entryId, pending.file, { tempId }),
      );
    };
  }

  dismissFailedAttachment(entryId, tempId) {
    return (dispatch) => {
      dispatch(removePendingAttachment({ id: entryId, tempId }));
    };
  }

  deleteAttachment(entryId, attachmentId) {
    return async (dispatch) => {
      try {
        const response = await this.journalApi.deleteAttachment(
          entryId,
          attachmentId,
        );
        if (
          response.status === 200 ||
          response.status === 204 ||
          response.status === 404
        ) {
          dispatch(removeAttachment({ id: entryId, attachmentId }));
          dispatch(popMessage('Attachment deleted'));
          return true;
        }
        dispatch(popErrorMessage('Failed to delete attachment'));
        return false;
      } catch (err) {
        dispatch(popErrorMessage('Failed to delete attachment'));
        return false;
      }
    };
  }

  downloadAttachment(entryId, attachment) {
    return async (dispatch) => {
      const attachmentId =
        attachment?.attachment_id ||
        attachment?.id ||
        attachment?.attachmentId;
      if (!entryId || !attachmentId) return;
      try {
        const result = await this.journalApi.downloadAttachment(
          entryId,
          attachmentId,
        );
        if (!result.blob) {
          dispatch(popErrorMessage('Failed to download attachment'));
          return;
        }
        const filename =
          result.filename ||
          attachment.filename ||
          attachment.name ||
          'attachment';
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        dispatch(popErrorMessage('Failed to download attachment'));
      }
    };
  }
}

export const journalActions = new JournalActions();
