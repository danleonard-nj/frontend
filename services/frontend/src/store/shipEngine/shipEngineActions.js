import autoBind from 'auto-bind';
import ShipEngineApi from '../../api/shipEngine';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import { closeDialog, dialogType } from '../dialog/dialogSlice';

import {
  setBalances,
  setCarriers,
  setCreatedShipment,
  setCreateShipment,
  setEstimate,
  setEstimateLoading,
  setLabel,
  setLabelLoading,
  setLookups,
  setRate,
  setRateLoading,
  setServiceCodes,
  setShipEnginePagination,
  setShipments,
  setShipmentsLoading,
} from './shipEngineSlice';

const tryParse = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return false;
  }
};

const groupByCarrierId = (data) => {
  // Exclude duplicate UPS carrier
  // const excludedCarrierId = 'se-485981';
  const shipEngineUps = 'se-485981';

  const grouped = {};

  data.forEach((item) => {
    // if (item.carrier_id === excludedCarrierId) return; // Skip excluded carrier

    if (!grouped[item.carrier_id]) {
      grouped[item.carrier_id] = {
        carrier_id: item.carrier_id,
        carrier_friendly_name:
          item.carrier_id == shipEngineUps
            ? 'UPS (ShipEngine)'
            : item.carrier_friendly_name,
        estimates: [],
      };
    }
    grouped[item.carrier_id].estimates.push(item);
  });

  return Object.values(grouped);
};

export default class ShipEngineActions {
  constructor() {
    this.shipEngineApi = new ShipEngineApi();
    autoBind(this);
  }

  getShipments() {
    return async (dispatch, getState) => {
      const state = getState();
      dispatch(setShipmentsLoading());

      const pageNumber = state.shipEngine.pagination.pageNumber ?? 1;
      const pageSize = state.shipEngine.pagination.pageSize ?? 10;
      const showCanceledShipments =
        state.shipEngine.showCanceledShipments;

      const response = await this.shipEngineApi.getShipments(
        pageNumber,
        pageSize,
        showCanceledShipments
      );

      const shipments = response?.data;

      dispatch(
        updateShipEnginePagination((pag) => ({
          ...pag,
          pageNumber: shipments.page_number,
          totalPages: shipments.total_pages,
        }))
      );

      // if (!showCanceledShipments) {
      //   const filteredShipments = (shipments?.shipments ?? []).filter(
      //     (x) => x.shipment_status !== 'Canceled'
      //   );
      //   dispatch(setShipments(filteredShipments ?? []));
      // } else {
      dispatch(setShipments(shipments?.shipments ?? []));
      // }
    };
  }

  getCarriers() {
    return async (dispatch, getState) => {
      const carriers = await this.shipEngineApi.getCarriers();
      dispatch(setCarriers(carriers));
    };
  }

  getLabel(shipmentId) {
    return async (dispatch, getState) => {
      dispatch(setLabelLoading());

      const response = await this.shipEngineApi.getLabel(shipmentId);
      const label = response?.data?.label;
      dispatch(setLabel({ details: label }));
    };
  }

  getBalances() {
    return async (dispatch, getState) => {
      // const balances = await this.shipEngineApi.getBalances();
      dispatch(setBalances({}));
    };
  }

  cancelShipment(shipmentId) {
    return async (dispatch, getState) => {
      // Set shipment table loading
      dispatch(setShipmentsLoading());

      // Cancel the shipment
      await this.shipEngineApi.cancelShipment(shipmentId);

      // Fetch shipments again after canceling (this will also update the loading flag)
      dispatch(this.getShipments());
    };
  }

  createLabel(shipmentId) {
    return async (dispatch, getState) => {
      const { status, data } = await this.shipEngineApi.createLabel(
        shipmentId
      );

      // Parse the response
      const message = tryParse(data);

      if (!status || status !== 200) {
        dispatch(
          popErrorMessage(
            `Failed to create label from shipment: ${data?.message}`
          )
        );
      } else {
        // Set the new label
        const label = data?.label;
        dispatch(setLabel({ details: label }));
      }
    };
  }

  voidLabel(labelId) {
    return async (dispatch, getState) => {
      const { status, data } = await this.shipEngineApi.voidLabel(
        labelId
      );

      if (!status || status !== 200) {
        if (data?.shipengine_status !== 200) {
          dispatch(
            popErrorMessage(
              `Failed to void label: ${JSON.stringify(data)}`
            )
          );
        }
      } else {
        dispatch(
          popMessage(`Label ${labelId} has been voided successfully`)
        );
      }
    };
  }

  getServiceCodes() {
    return async (dispatch, getState) => {
      const response = await this.shipEngineApi.getServiceCodes();
      const serviceCodes = response?.data?.service_codes ?? [];
      dispatch(setServiceCodes(serviceCodes));
    };
  }

  getRate() {
    return async (dispatch, getState) => {
      const state = getState();

      dispatch(setEstimateLoading(true));

      const { data } = await this.shipEngineApi.getRate(
        state.shipEngine.createShipment
      );

      const groupedEstimates = groupByCarrierId(data ?? []);

      dispatch(setEstimate(groupedEstimates));
      dispatch(setEstimateLoading(false));
    };
  }

  estimateRate() {
    return async (dispatch, getState) => {
      const state = getState();
      dispatch(setEstimateLoading(true));

      const shipment = state.shipEngine.createShipment;
      console.log('estimateRate', shipment);

      // Fetch rate estimate
      const estimate = await this.shipEngineApi.estimateRates(
        shipment
      );

      console.log(estimate);

      const groupedEstimates = groupByCarrierId(estimate?.data ?? []);

      console.log(groupedEstimates);

      dispatch(setEstimate(groupedEstimates));
      dispatch(setEstimateLoading(false));
    };
  }

  postCreateShipment() {
    return async (dispatch, getState) => {
      const state = getState();

      const createRequest = {
        ...state.shipEngine.createShipment,
        dimensions: {
          height: state.shipEngine.createShipment.height,
          length: state.shipEngine.createShipment.length,
          width: state.shipEngine.createShipment.width,
        },
      };

      const createdShipment =
        await this.shipEngineApi.postCreateShipment(createRequest);

      dispatch(setCreatedShipment(createdShipment));
      dispatch(closeDialog(dialogType.createShipment));
      dispatch(getShipments());
    };
  }

  getLookups() {
    return async (dispatch, getState) => {
      const carriersResponse = await this.shipEngineApi.getCarriers();
      const carriers = carriersResponse?.data?.carriers;

      const serviceCodesResponse =
        await this.shipEngineApi.getServiceCodes();
      const serviceCodes =
        serviceCodesResponse?.data?.service_codes ?? [];

      const serviceCodeLookup = [...serviceCodes].reduce(
        (obj, val) => ({ ...obj, [val.service_code]: val.name }),
        {}
      );

      const carrierNameLookup = [...carriers].reduce(
        (obj, val) => ({ ...obj, [val.carrier_id]: val.name }),
        {}
      );

      dispatch(setLookups({ serviceCodeLookup, carrierNameLookup }));
    };
  }

  updateCreateShipment(func) {
    return (dispatch, getState) => {
      const state = getState();
      dispatch(
        setCreateShipment(func(state.shipEngine.createShipment))
      );
    };
  }

  updateShipEnginePagination(func) {
    return (dispatch, getState) => {
      const state = getState();
      dispatch(
        setShipEnginePagination(func(state.shipEngine.pagination))
      );
    };
  }
}

export const {
  updateShipEnginePagination,
  updateCreateShipment,
  getLookups,
  postCreateShipment,
  getRate,
  estimateRate,
  getServiceCodes,
  createLabel,
  cancelShipment,
  getBalances,
  getLabel,
  getCarriers,
  getShipments,
  voidLabel,
} = new ShipEngineActions();
