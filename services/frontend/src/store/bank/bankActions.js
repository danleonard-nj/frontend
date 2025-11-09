import autoBind from 'auto-bind';
import BankApi from '../../api/bankApi';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage } from '../alert/alertActions';
import {
  setBalance,
  setBalanceLoading,
  setBalances,
  setBalancesLoading,
  setBalanceHistory,
  setBalanceHistoryLoading,
  setTransactions,
  setTransactionsLoading,
} from './bankSlice';
import { orderBy } from 'lodash';

const getISODate = (date) => date.toISOString().split('T')[0];

const getStartOfDayTimestamp = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
};

const getEndOfDayTimestamp = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return Math.floor(d.getTime() / 1000);
};

export default class BankActions {
  constructor() {
    this.bankApi = new BankApi();
    autoBind(this);
  }

  getBalances() {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data, status }) => {
        dispatch(
          popErrorMessage(
            `${status}: Failed to fetch bank balances: ${getErrorMessage(
              data
            )}`
          )
        );
      };

      const handleSuccessResponse = ({ data }) => {
        const sorted = orderBy(
          data?.balances ?? [],
          'bank_key',
          'desc'
        );
        dispatch(setBalances(sorted));
      };

      const response = await this.bankApi.getBalances();

      response.status === 200
        ? handleSuccessResponse(response)
        : handleErrorResponse(response);

      dispatch(setBalancesLoading(false));
    };
  }

  getBalance(key) {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data, status }) => {
        dispatch(
          popErrorMessage(
            `${status}: Failed to fetch balance for bank key '${key}': ${getErrorMessage(
              data
            )}`
          )
        );
      };

      dispatch(setBalanceLoading(true));

      const response = await this.bankApi.getBalance(key);

      response.status === 200
        ? dispatch(setBalance(response.data))
        : handleErrorResponse(response);

      dispatch(setBalanceLoading(false));
    };
  }

  getTransactions() {
    return async (dispatch, getState) => {
      const {
        transactionsParams: { startDate, endDate },
        selectedBankKey,
      } = getState().bank;

      console.log('params', startDate, endDate, selectedBankKey);

      const handleErrorResponse = ({ data, status }) => {
        dispatch(
          popErrorMessage(
            `${status}: Failed to fetch transactions for bank key '${selectedBankKey}': ${getErrorMessage(
              data
            )}`
          )
        );
      };

      dispatch(setTransactionsLoading(true));

      const response = await this.bankApi.getTransactions(
        getISODate(startDate),
        getISODate(endDate),
        [selectedBankKey]
      );

      response.status === 200
        ? dispatch(setTransactions(response.data))
        : handleErrorResponse(response);

      dispatch(setTransactionsLoading(false));
    };
  }

  getBalanceHistory() {
    return async (dispatch, getState) => {
      const {
        balanceHistoryParams: { startDate, endDate },
        selectedBankKey,
      } = getState().bank;

      const handleErrorResponse = ({ data, status }) => {
        dispatch(
          popErrorMessage(
            `${status}: Failed to fetch balance history for bank key '${selectedBankKey}': ${getErrorMessage(
              data
            )}`
          )
        );
      };

      dispatch(setBalanceHistoryLoading(true));

      // Set default date range if not provided (last 2 years)
      const defaultEndDate = new Date();
      const defaultStartDate = new Date();
      defaultStartDate.setFullYear(
        defaultStartDate.getFullYear() - 2
      );

      const response = await this.bankApi.getBalanceHistory(
        getStartOfDayTimestamp(startDate || defaultStartDate),
        getEndOfDayTimestamp(endDate || defaultEndDate),
        [selectedBankKey]
      );

      if (response.status === 200) {
        // The API returns an object with bank_key as keys, extract the array for selected bank
        const historyData = response.data[selectedBankKey] || [];
        dispatch(setBalanceHistory(historyData));
      } else {
        handleErrorResponse(response);
      }

      dispatch(setBalanceHistoryLoading(false));
    };
  }

  deleteBalance(balanceId) {
    return async (dispatch, getState) => {
      const handleErrorResponse = ({ data, status }) => {
        dispatch(
          popErrorMessage(
            `${status}: Failed to delete balance: ${getErrorMessage(
              data
            )}`
          )
        );
      };

      const response = await this.bankApi.deleteBalance(balanceId);

      if (response.status === 200 || response.status === 204) {
        // Refresh the balance history after successful deletion
        dispatch(this.getBalanceHistory());
      } else {
        handleErrorResponse(response);
      }
    };
  }
}

export const {
  getBalances,
  getBalance,
  getTransactions,
  getBalanceHistory,
  deleteBalance,
} = new BankActions();
