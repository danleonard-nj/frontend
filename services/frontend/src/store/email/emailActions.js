import autoBind from 'auto-bind';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import GmailRuleApi from '../../api/gmailRuleApi';
import {
  setEmailRule,
  setEmailRuleLoading,
  setEmailRules,
  setEmailRulesLoading,
} from './emailSlice';

class EmailActions {
  constructor() {
    autoBind(this);
    this.gmailRulesApi = new GmailRuleApi();
  }

  getEmailRules() {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to fetch
          const errorMessage = getErrorMessage(data);
          dispatch(popErrorMessage(errorMessage));
        } else {
          // Set the rules on success
          dispatch(setEmailRules(data));
        }
      };

      dispatch(setEmailRulesLoading(true));

      const response = await this.gmailRulesApi.getRules();

      handleResponse(response);
    };
  }

  getEmailRule(ruleId) {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to get rule
          const error = getErrorMessage(data);
          dispatch(
            popErrorMessage(
              `Failed to fetch rule '${ruleId}': ${error}`
            )
          );
        } else {
          // Set the rules on success
          dispatch(setEmailRule(data));
        }
      };

      dispatch(setEmailRuleLoading(true));

      const response = await this.gmailRulesApi.getRule(ruleId);

      handleResponse(response);
    };
  }

  createEmailRule(rule) {
    return async (dispatch, getState) => {};
  }

  deleteEmailRule(ruleId) {
    return async (dispatch, getState) => {
      const handleResponse = ({ data, status }) => {
        if (status !== 200) {
          // Pop an error on failure to delete rule
          const error = getErrorMessage(data);
          dispatch(
            popErrorMessage(
              `Failed to delete rule '${ruleId}': ${error}`
            )
          );
        } else {
          // Set the rules on successful delete
          dispatch(
            popMessage(`Rule '${ruleId}' deleted successfully!`)
          );
        }
      };

      const response = await this.gmailRulesApi.deleteRule(ruleId);

      handleResponse(response);
    };
  }

  updateEmailRule(rule) {
    return async (dispatch, getState) => {};
  }
}

export const {
  getEmailRules,
  createEmailRule,
  deleteEmailRule,
  updateEmailRule,
  getEmailRule,
} = new EmailActions();
