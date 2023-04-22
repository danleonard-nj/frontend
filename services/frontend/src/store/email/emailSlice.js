import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emailRules: [],
  emailRulesLoading: true,
  emailRule: {},
  emailRuleLoading: true,
  selectedEmailRule: '',
};

const emailSlice = createSlice({
  name: 'email',
  initialState: initialState,
  reducers: {
    setEmailRules(state, { payload }) {
      state.emailRules = payload;
      state.emailRulesLoading = false;
    },
    setEmailRulesLoading(state, { payload }) {
      state.emailRulesLoading = payload;
    },
    setEmailRule(state, { payload }) {
      state.emailRule = payload;
      state.emailRuleLoading = false;
    },
    setEmailRuleLoading(state, { payload }) {
      state.emailRuleLoading = payload;
    },
    setSelectedEmailRule(state, { payload }) {
      state.selectedEmailRule = payload;
    },
  },
});

export const {
  setEmailRules,
  setEmailRulesLoading,
  setEmailRule,
  setEmailRuleLoading,
  setSelectedEmailRule,
} = emailSlice.actions;

export default emailSlice.reducer;
