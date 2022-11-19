import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { getFitnessDateStatsConfig } from '../apexChartConfig';

const DeficitTimeChart = () => {
  const stats = useSelector((x) => x.fitness.fitnessDates);
  const config = useSelector((x) => x.fitness.config);

  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    if (stats && config) {
      setChartConfig(getFitnessDateStatsConfig(stats, config));
    }
  }, [stats]);

  return (
    <ReactApexChart
      height='250px'
      series={chartConfig?.series ?? []}
      type='rangeBar'
      options={chartConfig?.options ?? {}}
    />
  );
};

export default DeficitTimeChart;
