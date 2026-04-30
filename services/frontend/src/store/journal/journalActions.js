import autoBind from 'auto-bind';
import JournalApi from '../../api/journalApi';
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
} from './journalSlice';

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

export function entryFromApi(raw) {
  if (!raw) return null;
  const createdAt = raw.created_at || raw.createdAt || null;
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
}

export const journalActions = new JournalActions();
