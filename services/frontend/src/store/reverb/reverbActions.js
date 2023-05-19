import autoBind from 'auto-bind';
import ReverbApi from '../../api/reverbApi';

import {
  setCreatedShipment,
  setCreatedShipmentLoading,
  setOrders,
} from './reverbSlice';
import { popErrorMessage } from '../alert/alertActions';
import { getErrorMessage } from '../../api/helpers/apiHelpers';

export default class ReverbActions {
  constructor() {
    this.reverbApi = new ReverbApi();
    autoBind(this);
  }

  getOrders(pageNumber) {
    return async (dispatch, getState) => {
      const handleErrorResultMessage = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(
              `Failed to fetch orders from Reverb API: ${getErrorMessage(
                data
              )}`
            )
          );
        }
      };

      const response = await this.reverbApi.getOrders(pageNumber);

      response.status === 200
        ? dispatch(setOrders(response?.data))
        : handleErrorResultMessage(response);
    };
  }

  createOrderShipment() {
    return async (dispatch, getState) => {
      const handleErrorResultMessage = ({ status, data }) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage(
              `Failed to create shipment: ${getErrorMessage(data)}`
            )
          );
        }
      };

      const state = getState();
      dispatch(setCreatedShipmentLoading(true));

      const orderDetail = state.reverb.orderDetail;
      const orderNumber = state.reverb.selectedOrder?.order_number;

      const response = await this.reverbApi.createOrderShipment(
        orderNumber,
        orderDetail
      );

      const shipmentId = response?.shipment?.response?.shipment_id;

      response?.status === 200
        ? dispatch(setCreatedShipment(shipmentId))
        : handleErrorResultMessage(response);
    };
  }
}

export const { getOrders, createOrderShipment } = new ReverbActions();
