import autoBind from 'auto-bind';

class EmailActions {
  super() {
    autoBind(this);
  }

  getEmailRules() {
    return async (dispatch, getState) => {};
  }
  createEmailRule(rule) {
    return async (dispatch, getState) => {};
  }
  deleteEmailRule(ruleId) {
    return async (dispatch, getState) => {};
  }
  updateEmailRule(ruleId) {
    return async (dispatch, getState) => {};
  }
}

export const {
  getEmailRules,
  createEmailRule,
  deleteEmailRule,
  updateEmailRule,
} = new EmailActions();
