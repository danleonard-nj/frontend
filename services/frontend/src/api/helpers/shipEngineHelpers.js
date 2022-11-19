const getDimensions = (shipment) => {
  if (shipment?.packages?.length) {
    const shipmentPackage = shipment.packages[0];
    return `${shipmentPackage.length} x ${shipmentPackage.width} x ${shipmentPackage.height}`;
  }
};

const getWeight = (shipment) => {
  if (shipment?.packages?.length) {
    const shipmentPackage = shipment.packages[0];
    return shipmentPackage.weight;
  }
};

const reduceShipment = (shipment, event, value) => {
  return {
    ...shipment,
    [event.target.name]: value ?? event.target.value,
  };
};

const getPackageDetails = (shipment) => {
  if (shipment?.packages?.length) {
    return shipment.packages[0];
  }
};

const getServiceCodeName = (serviceCodeLookup, serviceCode) => {
  return serviceCodeLookup[serviceCode];
};

const reduceOrigin = (shipment, event) => {
  return {
    ...shipment,
    origin: { ...shipment.origin, [event.target.name]: event.target.value },
  };
};

const reduceDestination = (shipment, event) => {
  return {
    ...shipment,
    destination: {
      ...shipment.destination,
      [event.target.name]: event.target.value,
    },
  };
};

const getCarrierName = (carrierNameLookup, carrierId) => {
  return carrierNameLookup[carrierId];
};

const statusLookup = {
  label_purchased: 'Label Purchased',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

const getStatusName = (status) => {
  return status in statusLookup ? statusLookup[status] : status;
};

const getQuotesByCarrierId = (rates, carrierId) => {
  return rates[carrierId] ?? [];
};

const reduceSelectOrigin = (shipment, event) => {
  return {
    ...shipment,
    origin: {
      ...shipment.origin,
      state_province: event.target.value,
    },
  };
};

const reduceSelectDestination = (shipment, event) => {
  return {
    ...shipment,
    destination: {
      ...shipment.destination,
      state_province: event.target.value,
    },
  };
};

const tryParseInt = (value) => {
  try {
    return parseInt(value);
  } catch {
    return null;
  }
};

const states = [
  {
    name: 'Alabama',
    code: 'AL',
  },
  {
    name: 'Alaska',
    code: 'AK',
  },
  {
    name: 'Arizona',
    code: 'AZ',
  },
  {
    name: 'Arkansas',
    code: 'AR',
  },
  {
    name: 'California',
    code: 'CA',
  },
  {
    name: 'Colorado',
    code: 'CO',
  },
  {
    name: 'Connecticut',
    code: 'CT',
  },
  {
    name: 'Delaware',
    code: 'DE',
  },
  {
    name: 'Florida',
    code: 'FL',
  },
  {
    name: 'Georgia',
    code: 'GA',
  },
  {
    name: 'Hawaii',
    code: 'HI',
  },
  {
    name: 'Idaho',
    code: 'ID',
  },
  {
    name: 'Illinois',
    code: 'IL',
  },
  {
    name: 'Indiana',
    code: 'IN',
  },
  {
    name: 'Iowa',
    code: 'IA',
  },
  {
    name: 'Kansas',
    code: 'KS',
  },
  {
    name: 'Kentucky',
    code: 'KY',
  },
  {
    name: 'Louisiana',
    code: 'LA',
  },
  {
    name: 'Maine',
    code: 'ME',
  },
  {
    name: 'Maryland',
    code: 'MD',
  },
  {
    name: 'Massachusetts',
    code: 'MA',
  },
  {
    name: 'Michigan',
    code: 'MI',
  },
  {
    name: 'Minnesota',
    code: 'MN',
  },
  {
    name: 'Mississippi',
    code: 'MS',
  },
  {
    name: 'Missouri',
    code: 'MO',
  },
  {
    name: 'Montana',
    code: 'MT',
  },
  {
    name: 'Nebraska',
    code: 'NE',
  },
  {
    name: 'Nevada',
    code: 'NV',
  },
  {
    name: 'New Hampshire',
    code: 'NH',
  },
  {
    name: 'New Jersey',
    code: 'NJ',
  },
  {
    name: 'New Mexico',
    code: 'NM',
  },
  {
    name: 'New York',
    code: 'NY',
  },
  {
    name: 'North Carolina',
    code: 'NC',
  },
  {
    name: 'North Dakota',
    code: 'ND',
  },
  {
    name: 'Ohio',
    code: 'OH',
  },
  {
    name: 'Oklahoma',
    code: 'OK',
  },
  {
    name: 'Oregon',
    code: 'OR',
  },
  {
    name: 'Pennsylvania',
    code: 'PA',
  },
  {
    name: 'Rhode Island',
    code: 'RI',
  },
  {
    name: 'South Carolina',
    code: 'SC',
  },
  {
    name: 'South Dakota',
    code: 'SD',
  },
  {
    name: 'Tennessee',
    code: 'TN',
  },
  {
    name: 'Texas',
    code: 'TX',
  },
  {
    name: 'Utah',
    code: 'UT',
  },
  {
    name: 'Vermont',
    code: 'VT',
  },
  {
    name: 'Virginia',
    code: 'VA',
  },
  {
    name: 'Washington',
    code: 'WA',
  },
  {
    name: 'West Virginia',
    code: 'WV',
  },
  {
    name: 'Wisconsin',
    code: 'WI',
  },
  {
    name: 'Wyoming',
    code: 'WY',
  },
];

const trackShipment = (trackingNumber) => {
  window.open(
    `https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=${trackingNumber}`,
    '_blank'
  );
};

const tooltipText = {
  cancelLabel: 'Cancel the label',
  cannotCancelLabel: 'The label is already in transit and cannot be canceled',
};

const canCancelLabel = (label) => {
  return !label?.details?.tracking_status === 'in_transit';
};

const getLabelStatus = (labelStatus) => {
  switch (labelStatus) {
    case 'completed':
      return 'Completed';
    default:
      return labelStatus;
  }
};

const getTrackingStatus = (trackingStatus) => {
  switch (trackingStatus) {
    case 'in_transit':
      return 'In Transit';
    default:
      return trackingStatus;
  }
};

export {
  getTrackingStatus,
  getLabelStatus,
  canCancelLabel,
  tooltipText,
  trackShipment,
  getServiceCodeName,
  getStatusName,
  states,
  tryParseInt,
  getDimensions,
  getWeight,
  reduceDestination,
  reduceOrigin,
  reduceSelectDestination,
  reduceSelectOrigin,
  reduceShipment,
  getCarrierName,
  getPackageDetails,
  getQuotesByCarrierId,
};
