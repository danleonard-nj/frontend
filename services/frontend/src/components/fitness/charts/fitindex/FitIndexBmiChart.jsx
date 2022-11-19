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

const FitIndexBmiChart = () => {
  const fitIndex = useSelector((x) => x.fitness?.fitnessRange?.fitindex) ?? [];

  const { data, options } = buildChartData(
    fitIndex,
    (item) => new Date(item.date).toLocaleDateString('en-US'),
    (item) => item.bmi,
    'BMI',
    'FitIndex',
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

export default FitIndexBmiChart;
