import autoBind from 'auto-bind';
import GmailRuleApi from '../../api/gmailRuleApi';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage, popMessage } from '../alert/alertActions';
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
      dispatch(setEmailRulesLoading(true));

      const { status, data } = await this.gmailRulesApi.getRules();

      if (status !== 200) {
        // Pop an error on failure to fetch
        const errorMessage = getErrorMessage(data);
        dispatch(popErrorMessage(errorMessage));
      } else {
        // Set the rules on success
        dispatch(setEmailRules(data));
      }

      dispatch(setEmailRulesLoading(false));
    };
  }

  getEmailRule(ruleId) {
    return async (dispatch, getState) => {
      dispatch(setEmailRuleLoading(true));

      const { status, data } = await this.gmailRulesApi.getRule(
        ruleId
      );

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

      dispatch(setEmailRuleLoading(false));
    };
  }

  createEmailRule(rule) {
    return async (dispatch, getState) => {
      const { status, data } = await this.gmailRulesApi.createRule(
        rule
      );

      // TODO: Set rule loading here?

      if (status !== 200) {
        // Pop an error on failure to delete rule
        const error = getErrorMessage(data);
        dispatch(popErrorMessage(`Failed to create rule: ${error}`));
      } else {
        // Set the rules on successful delete
        dispatch(popMessage(`Rule created successfully!`));
      }
    };
  }

  deleteEmailRule(ruleId) {
    return async (dispatch, getState) => {
      const { status, data } = await this.gmailRulesApi.deleteRule(
        ruleId
      );

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
  }

  updateEmailRule(rule) {
    return async (dispatch, getState) => {
      const { status, data } = await this.gmailRulesApi.updateRule(
        rule
      );

      if (status !== 200) {
        // Pop an error on failure to delete rule
        const error = getErrorMessage(data);
        dispatch(popErrorMessage(`Failed to update rule: ${error}`));
      } else {
        // Set the rules on successful delete
        dispatch(popMessage(`Rule updated successfully!`));
      }
    };
  }

  clearEmailRule() {
    return async (dispatch, getState) => {
      dispatch(
        setEmailRule({
          rule_id: '',
          name: '',
          description: '',
          max_results: 10,
          query: 'from:',
          action: 'sms',
          data: {},
          created_date: new Date().toISOString(),
        })
      );
    };
  }
}

export const {
  getEmailRules,
  createEmailRule,
  deleteEmailRule,
  updateEmailRule,
  getEmailRule,
  clearEmailRule,
} = new EmailActions();
