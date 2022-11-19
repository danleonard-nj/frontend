const getErrorMessage = (data) => {
  return `${data.error}: ${data.message}`;
};

const sortBy = (obj, prop) => {
  const sortFunc = (x, y) => (x[prop] > y[prop] ? 1 : -1);
  obj.sort(sortFunc);
};

const replace = (selector, items, replacement) => {
  return items.map((item) => (selector(item) ? replacement : item));
};

export { getErrorMessage, sortBy, replace };
