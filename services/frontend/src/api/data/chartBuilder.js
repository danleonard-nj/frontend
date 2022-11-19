import { sortBy } from '../helpers/apiHelpers';
import { getSum } from '../helpers/mathHelpers';

const buildChartData = (
  source,
  xAxisSelector,
  yAxisSelector,
  xAxisLabel,
  chartTitle,
  dataOptions,
  sortKey
) => {
  if (!source) {
    return {};
  }

  const sortBy = (list, prop) => {
    const sortFunc = (x, y) => (x[prop] > y[prop] ? 1 : -1);
    return [...list].sort(sortFunc);
  };

  if (sortKey) {
    source = sortBy(source, sortKey);
  }

  const labels = source.map((item) => xAxisSelector(item));
  const values = source.map((item) => yAxisSelector(item));

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        label: xAxisLabel,
        ...dataOptions,
      },
    ],
  };

  return { data, options };
};

export { buildChartData };
