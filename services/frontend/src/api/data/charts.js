const getTimelineData = (chartData) => ({
  data: (chartData ?? [])
    .map((item) => ({
      x: `Deficit ${item.deficit}`,
      y: [new Date().getTime(), new Date(item.target).getTime()],
    }))
    .reverse(),
});

const getOptions = (config) => ({
  tite: `Target: ${config.target_value} lbs`,
  chart: {
    foreColor: '#FFFFFF',
    type: 'rangeBar',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
      dataLabels: {
        hideOverflowingLabels: false,
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: 80,
    style: {
      colors: ['#FFFFFF'],
    },
    formatter: (val, opts) => {
      return new Date(val[1]).toLocaleDateString();
    },
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    show: true,
  },
  grid: {
    row: {
      opacity: 1,
    },
  },
});

const getFitnessDateStatsConfig = (chartData, config) => ({
  series: [getTimelineData(chartData ?? [])],
  options: getOptions(config),
});

export { getFitnessDateStatsConfig };
