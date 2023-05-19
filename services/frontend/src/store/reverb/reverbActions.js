import autoBind from 'auto-bind';
import ReverbApi from '../../api/reverbApi';

import {
  setCreatedShipment,
  setCreatedShipmentLoading,
  setOrders,
} from './reverbSlice';

export default class ReverbActions {
  constructor() {
    this.reverbApi = new ReverbApi();
    autoBind(this);
  }

  getOrders(pageNumber) {
    return async (dispatch, getState) => {
      const orders = await this.reverbApi.getOrders(pageNumber);
      dispatch(setOrders(orders?.data?.orders));
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
      dispatch(setCreatedShipment(response?.shipment?.response?.shipment_id));
    };
  }
}

export const { getOrders, createOrderShipment } = new ReverbActions();
