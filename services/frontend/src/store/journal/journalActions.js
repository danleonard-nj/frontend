import autoBind from 'auto-bind';
import JournalApi from '../../api/journalApi';
import { popErrorMessage } from '../alert/alertActions';
import {
  setCategories,
  setCategoriesLoading,
  setEntries,
  setEntriesLoading,
  setSelectedCategory,
  setSelectedCategoryLoading,
  setSelectedEntry,
  setSelectedEntryLoading,
  setSelectedUnit,
  setSelectedUnitLoading,
  setUnits,
  setUnitsLoading,
} from './journalSlice';

class JournalActions {
  constructor() {
    autoBind(this);
    this.journalApi = new JournalApi();
  }

  getEntries() {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(popErrorMessage('Failed to load journal entries'));
        } else {
          // Store the poll result
          dispatch(setEntries(data));
        }
      };

      dispatch(setEntriesLoading(true));

      const {
        entryDateRangeParams: { startDate, endDate },
      } = getState().journal;

      const response = await this.journalApi.getEntries(
        startDate,
        endDate
      );

      handleResponse(response);

      dispatch(setEntriesLoading(false));
    };
  }

  createEntry() {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(popErrorMessage('Failed to create journal entry'));
        } else {
          // Store the poll result
          dispatch(setSelectedEntry(data));
        }
      };

      dispatch(setSelectedEntryLoading(true));

      const { selectedEntry } = getState().journal;

      const response = await this.journalApi.createEntry(
        selectedEntry
      );

      handleResponse(response);

      dispatch(setSelectedEntryLoading(false));
    };
  }

  getEntry(entryId) {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(popErrorMessage('Failed to load journal entry'));
        } else {
          // Store the poll result
          dispatch(setSelectedEntry(data));
        }
      };

      dispatch(setSelectedEntryLoading(true));

      const response = await this.journalApi.getEntry(entryId);

      handleResponse(response);

      dispatch(setSelectedEntryLoading(false));
    };
  }

  deleteEntry(entryId) {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(popErrorMessage('Failed to delete journal entry'));
        }
      };

      dispatch(setSelectedEntryLoading(true));

      const response = await this.journalApi.deleteEntry(entryId);

      handleResponse(response);

      dispatch(setSelectedEntryLoading(false));
    };
  }

  getUnits() {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(popErrorMessage('Failed to fetch journal units'));
        } else {
          // Store the poll result
          dispatch(setUnits(data));
        }
      };

      dispatch(setUnitsLoading(true));

      const response = await this.journalApi.getUnits();

      handleResponse(response);

      dispatch(setUnitsLoading(false));
    };
  }

  createUnit() {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(popErrorMessage('Failed to create journal unit'));
        } else {
          // Store the poll result
          dispatch(setSelectedUnit(data));
        }
      };

      dispatch(setSelectedUnitLoading(true));

      const { selectedUnit } = getState().journal;

      const response = await this.journalApi.createUnit(selectedUnit);

      handleResponse(response);

      dispatch(setSelectedCategoryLoading(false));
    };
  }

  deleteUnit(unitId) {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(popErrorMessage('Failed to delete journal unit'));
        }
      };

      dispatch(setSelectedUnitLoading(true));

      const response = await this.journalApi.deleteUnit(unitId);

      handleResponse(response);

      dispatch(setSelectedUnitLoading(false));
    };
  }

  getCategories() {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(
            popErrorMessage('Failed to fetch journal categories')
          );
        } else {
          // Store the poll result
          dispatch(setCategories(data));
        }
      };

      dispatch(setCategoriesLoading(true));

      const response = await this.journalApi.getCategories();

      handleResponse(response);

      dispatch(setCategoriesLoading(false));
    };
  }

  createCategory() {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(
            popErrorMessage('Failed to create journal category')
          );
        } else {
          // Store the poll result
          dispatch(setSelectedCategory(data));
        }
      };

      dispatch(setSelectedCategoryLoading(true));

      const { selectedCategory } = getState().journal;

      const response = await this.journalApi.createCategory(
        selectedCategory
      );

      handleResponse(response);

      dispatch(setSelectedCategoryLoading(false));
    };
  }

  deleteCategory(categoryId) {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to poll
          dispatch(popErrorMessage('Failed to delete journal unit'));
        }
      };

      dispatch(setSelectedCategoryLoading(true));

      const response = await this.journalApi.deleteCategory(
        categoryId
      );

      handleResponse(response);

      dispatch(setSelectedCategoryLoading(false));
    };
  }
}

export const {
  getEntries,
  getEntry,
  createEntry,
  deleteEntry,
  getUnits,
  createUnit,
  deleteUnit,
  getCategories,
  createCategory,
  deleteCategory,
} = new JournalActions();
