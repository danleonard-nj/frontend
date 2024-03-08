import { createSlice } from '@reduxjs/toolkit';

const bankInitialState = {
  balancesLoading: true,
  balances: [],
  balance: null,
  balanceLoading: true,
  balanceHistory: [],
  balanceHistoryLoading: true,
  balanceHistoryParams: {
    startDate: '',
    endDate: '',
  },
  transactions: [],
  transactionsLoading: true,
  transactionsParams: {
    startDate: '',
    endDate: '',
  },
  showPendingTransactions: true,
  selectedBankKey: '',
  selectedTab: 'balances',
};

const bankSlice = createSlice({
  name: 'bank',
  initialState: bankInitialState,
  reducers: {
    setBalancesLoading(state, { payload }) {
      state.balancesLoading = payload;
    },
    setBalances(state, { payload }) {
      state.balances = payload;
    },
    setBalanceLoading(state, { payload }) {
      state.balanceLoading = payload;
    },
    setBalance(state, { payload }) {
      state.balance = payload;
    },
    setBalanceHistoryLoading(state, { payload }) {
      state.balanceHistoryLoading = payload;
    },
    setBalanceHistory(state, { payload }) {
      state.balanceHistory = payload;
    },
    setTransactionsLoading(state, { payload }) {
      state.transactionsLoading = payload;
    },
    setTransactions(state, { payload }) {
      state.transactions = payload;
    },
    setSelectedBankKey(state, { payload }) {
      state.selectedBankKey = payload;
    },
    setBalanceHistoryParams(state, { payload }) {
      state.balanceHistoryParams = payload;
    },
    setTransactionParams(state, { payload }) {
      state.transactionsParams = payload;
    },
    setSelectedTab(state, { payload }) {
      state.selectedTab = payload;
    },
    setShowPendingTransactions(state, { payload }) {
      state.showPendingTransactions = payload;
    },
  },
});

export const {
  setBalances,
  setBalancesLoading,
  setBalance,
  setBalanceLoading,
  setBalanceHistory,
  setBalanceHistoryLoading,
  setTransactions,
  setTransactionsLoading,
  setSelectedTab,
  setSelectedBankKey,
  setBalanceHistoryParams,
  setTransactionParams,
  setShowPendingTransactions,
} = bankSlice.actions;

export default bankSlice.reducer;
