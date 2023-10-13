import { createSlice } from '@reduxjs/toolkit';
import {
  addDays,
  toDateString,
} from '../../api/helpers/dateTimeUtils';

const initialState = {
  entries: [],
  entriesLoading: true,
  entryDateRangeParams: {
    startDate: toDateString(addDays(new Date(), -7)),
    endDate: toDateString(new Date()),
  },
  categories: [],
  categoriesLoading: true,
  units: [],
  unitsLoading: true,
  selectedEntry: {},
  selectedEntryLoading: true,
  selectedCategory: {},
  selectedCategoryLoading: true,
  selectedUnit: {},
  selectedUnitLoading: true,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState: initialState,
  reducers: {
    setEntries(state, { payload }) {
      state.entries = payload;
    },
    setEntriesLoading(state, { payload }) {
      state.entriesLoading = payload;
    },
    setCategories(state, { payload }) {
      state.categories = payload;
    },
    setCategoriesLoading(state, { payload }) {
      state.categoriesLoading = payload;
    },
    setUnits(state, { payload }) {
      state.units = payload;
    },
    setUnitsLoading(state, { payload }) {
      state.unitsLoading = payload;
    },
    setSelectedEntry(state, { payload }) {
      state.selectedEntry = payload;
    },
    setSelectedEntryLoading(state, { payload }) {
      state.selectedEntryLoading = payload;
    },
    setEntryDateRangeParams(state, { payload }) {
      state.entryDateRangeParams = payload;
    },
    setSelectedCategory(state, { payload }) {
      state.selectedCategory = payload;
    },
    setSelectedCategoryLoading(state, { payload }) {
      state.selectedCategoryLoading = payload;
    },
    setSelectedUnit(state, { payload }) {
      state.selectedUnit = payload;
    },
    setSelectedUnitLoading(state, { payload }) {
      state.selectedUnitLoading = payload;
    },
  },
});

export const {
  setEntries,
  setEntriesLoading,
  setCategories,
  setCategoriesLoading,
  setUnits,
  setUnitsLoading,
  setSelectedEntry,
  setSelectedEntryLoading,
  setEntryDateRangeParams,
  setSelectedCategory,
  setSelectedCategoryLoading,
  setSelectedUnit,
  setSelectedUnitLoading,
} = journalSlice.actions;

export default journalSlice.reducer;
