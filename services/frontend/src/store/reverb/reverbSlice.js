import { createSlice } from '@reduxjs/toolkit';
import { reverbState } from '../../api/data/reverb';

const reverbSlice = createSlice({
  name: 'reverb',
  initialState: reverbState,
  reducers: {
    setOrders(state, { payload }) {
      state.ordersLoading = false;
      state.orders = payload;
    },
    setCreatedShipmentLoading(state, { payload }) {
      state.createdShipmentLoading = payload;
    },
    updateOrderDetail(state, { payload }) {
      state.orderDetail = payload;
    },
    setSelectedOrder(state, { payload }) {
      state.selectedOrder = payload;
    },
    setCreatedShipment(state, { payload }) {
      state.createdShipment = payload;
      state.createdShipmentLoading = false;
    },
  },
});

export const {
  setOrders,
  updateOrderDetail,
  setSelectedOrder,
  setCreatedShipment,
  setCreatedShipmentLoading,
} = reverbSlice.actions;

export default reverbSlice.reducer;
