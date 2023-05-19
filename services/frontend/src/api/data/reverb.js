const initialOrderDetail = {
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

export { reverbState, initialOrderDetail };
