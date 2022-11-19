import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { buildChartData } from '../../../api/data/chartBuilder';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DeltaChart = () => {
  const { deficits } = useSelector((x) => x.fitness.calorieDeltas) ?? {};
  console.log('deficits ', deficits);
  const { data, options } = buildChartData(
    deficits,
    (item) => new Date(item.timestamp * 1000).toLocaleDateString('en-US'),
    (item) => item.delta,
    'Delta',
    'Deficits',
    { backgroundColor: 'rgba(255, 99, 132, 0.5)' }
  );

  return <Bar options={options} data={data} />;
};

export default DeltaChart;
