import autoBind from 'auto-bind';
import BankApi from '../../api/bankApi';
import { getErrorMessage } from '../../api/helpers/apiHelpers';
import { popErrorMessage } from '../alert/alertActions';
import {
  setBalance,
  setBalanceLoading,
  setBalances,
  setBalancesLoading,
} from './bankSlice';

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

      dispatch(setBalancesLoading(true));

      const response = await this.bankApi.getBalances();

      response.status === 200
        ? dispatch(setBalances(response.data))
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
}

export const { getBalances, getBalance } = new BankActions();
