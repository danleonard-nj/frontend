import autoBind from 'auto-bind';
import ReverbApi from '../../api/reverbApi';

import { popErrorMessage } from '../alert/alertActions';
import {
  setCreatedShipment,
  setCreatedShipmentLoading,
  setOrders,
  setOrdersLoading,
} from './reverbSlice';

export default class ReverbActions {
  constructor() {
    this.reverbApi = new ReverbApi();
    autoBind(this);
  }

  getOrders(pageNumber) {
    return async (dispatch, getState) => {
      dispatch(setOrdersLoading(false));

      const { status, data } = await this.reverbApi.getOrders(
        pageNumber
      );

      status === 200
        ? dispatch(setOrders(data))
        : dispatch(popErrorMessage('Failed to fetch Reverb orders'));

      dispatch(setOrdersLoading(false));
    };
  }

  createOrderShipment() {
    return async (dispatch, getState) => {
      const state = getState();
      dispatch(setCreatedShipmentLoading(true));

      const orderDetail = state.reverb.orderDetail;
      const orderNumber = state.reverb.selectedOrder?.order_number;

      const response = await this.reverbApi.createOrderShipment(
        orderNumber,
        orderDetail
      );
      dispatch(
        setCreatedShipment(response?.shipment?.response?.shipment_id)
      );
    };
  }
}

export const { getOrders, createOrderShipment } = new ReverbActions();
