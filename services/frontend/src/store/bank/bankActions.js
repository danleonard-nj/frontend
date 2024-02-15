import autoBind from 'auto-bind';
import BankApi from '../../api/bankApi';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage } from '../alert/alertActions';
import {
  setBalance,
  setBalanceLoading,
  setBalances,
  setBalancesLoading,
  setTransactions,
  setTransactionsLoading,
} from './bankSlice';
import { orderBy } from 'lodash';

const getISODate = (date) => date.toISOString().split('T')[0];

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
}

export const { getBalances, getBalance, getTransactions } =
  new BankActions();
