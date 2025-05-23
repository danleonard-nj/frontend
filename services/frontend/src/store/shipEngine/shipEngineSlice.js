import { createSlice } from '@reduxjs/toolkit';
import { shipEngineState } from '../../api/data/shipEngine';

const labelReducers = {
  setLabel(state, { payload }) {
    state.label = payload;
    state.labelLoading = false;
  },
  setLabelLoading(state, { payload }) {
    state.labelLoading = true;
  },
};

const shipmentReducers = {
  setShipments(state, { payload }) {
    state.shipments = payload;
    state.shipmentsLoading = false;
  },
  setShipmentsLoading(state, { payload }) {
    state.shipmentsLoading = payload ?? true;
  },
};

const addressBookReducers = {
  setAddressBook(state, { payload }) {
    state.shipments = payload;
    state.shipmentsLoading = false;
  },
  setAddressBookLoading(state, { payload }) {
    state.shipmentsLoading = payload ?? true;
  },
};

const rateReducers = {
  setRate(state, { payload }) {
    state.rate = payload;
    state.rateLoading = false;
  },
  setRateLoading(state, { payload }) {
    // Switched to using estimate loading state
    state.estimateLoading = true;
  },
  // Rate estimates
  setEstimate(state, { payload }) {
    state.estimate = payload;
    state.estimateLoading = false;
  },
  setEstimateLoading(state, { payload }) {
    state.estimateLoading = payload;
  },
};

const shipEngineReducers = {
  setCarriers(state, { payload }) {
    state.carriers = payload;
    state.carriersLoading = false;
  },
  setServiceCodes(state, { payload }) {
    state.serviceCodes = payload;
    state.serviceCodesLoading = false;
  },
  balancesFetching(state) {
    state.balancesLoaded = false;
  },
  setBalances(state, { payload }) {
    state.balances = payload;
    state.balancesLoading = false;
  },

  setLookups(state, { payload }) {
    const { serviceCodeLookup, carrierNameLookup } = payload;

    state.serviceCodeLookup = serviceCodeLookup;
    state.carrierNameLookup = carrierNameLookup;
    state.lookupsLoading = false;
  },
  setCreateShipment(state, { payload }) {
    state.createShipment = payload;
  },
  clearRate(state) {
    state.rate = null;
  },
  setCreatedShipment(state, { payload }) {
    state.createdShipment = payload;
    state.createdShipmentLoading = false;
  },
  setShipEnginePagination(state, { payload }) {
    state.pagination = payload;
  },
  setSelectedShipment(state, { payload }) {
    state.selectedShipment = payload;
  },
  setShowCanceledShipments(state, { payload }) {
    state.showCanceledShipments = payload;
  },
};

const shipEngineSlice = createSlice({
  name: 'shipEngine',
  initialState: shipEngineState,
  reducers: {
    ...shipEngineReducers,
    ...labelReducers,
    ...shipmentReducers,
    ...rateReducers,
    ...addressBookReducers,
  },
});

export const {
  setShipments,
  setShipmentsLoading,
  setCarriers,
  setBalances,
  setCreateShipment,
  setCreatedShipment,
  setLabel,
  setLabelLoading,
  setLookups,
  setRate,
  setRateLoading,
  setEstimate,
  setEstimateLoading,
  setSelectedShipment,
  setServiceCodes,
  setShipEnginePagination,
  setShowCanceledShipments,
  clearRate,
} = shipEngineSlice.actions;

export default shipEngineSlice.reducer;
