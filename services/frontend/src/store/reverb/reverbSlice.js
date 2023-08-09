import { createSlice } from '@reduxjs/toolkit';

export const initialOrderDetail = {
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
};

const reverbState = {
  orderDetail: initialOrderDetail,
  ordersLoading: true,
  orders: [],
  selectedOrder: {},
  createdShipmentLoading: false,
  createdShipment: {},
};

const reverbSlice = createSlice({
  name: 'reverb',
  initialState: reverbState,
  reducers: {
    setOrders(state, { payload }) {
      state.orders = payload;
    },
    setOrdersLoading(state, { payload }) {
      state.ordersLoading = payload;
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
  setOrdersLoading,
  updateOrderDetail,
  setSelectedOrder,
  setCreatedShipment,
  setCreatedShipmentLoading,
} = reverbSlice.actions;

export default reverbSlice.reducer;
