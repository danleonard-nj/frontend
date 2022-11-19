import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { buildChartData } from '../../../../api/data/chartBuilder';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const MyFitnessPalChart = () => {
  const myFitnessPal =
    useSelector((x) => x.fitness?.fitnessRange?.my_fitness_pal) ?? [];

  const { data, options } = buildChartData(
    myFitnessPal,
    (item) => new Date(item.timestamp * 1000).toLocaleDateString('en-US'),
    (item) => item.total_calories,
    'Calories',
    'MyFitnessPal',
    {
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      fill: true,
      lineTension: 0.5,
    },
    'timestamp'
  );

  return <Line options={options} data={data} />;
};

export default MyFitnessPalChart;
