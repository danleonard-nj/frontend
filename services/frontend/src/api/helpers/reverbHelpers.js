const isShipButtonDisabled = (order) => {
  return order?.order_status == 'shipped';
};

const formatCurrency = (value) => {
  return `$${value}`;
};

const formatDate = (value) => {
  return value == null ? null : new Date(value).toLocaleString();
};

export { isShipButtonDisabled, formatCurrency, formatDate };
