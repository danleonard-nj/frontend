import { createSlice } from '@reduxjs/toolkit';

const bankInitialState = {
  balancesLoading: true,
  balances: [],
  balance: null,
  balanceLoading: true,
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
  },
});

export const {
  setBalances,
  setBalancesLoading,
  setBalance,
  setBalanceLoading,
} = bankSlice.actions;

export default bankSlice.reducer;
