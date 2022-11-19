const getSum = (vals) => {
  var total = 0;
  for (const val of vals) {
    total += val;
  }

  console.log('Sum: ', total);

  return total;
};

const getAverage = (vals) => {
  const sum = getSum(vals);
  if (vals.length > 0) {
    return sum / vals.length;
  }
};

const getArrayBounds = (vals) => {
  const boundMin = Math.min.apply(Math, vals);
  const boundMax = Math.max.apply(Math, vals);

  return [boundMin, boundMax];
};

export { getAverage, getSum, getArrayBounds };
