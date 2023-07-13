const formatCurrency = (usageCents) => {
  const currencyFormatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
  });

  return currencyFormatter.format(usageCents);
};

export { formatCurrency };
