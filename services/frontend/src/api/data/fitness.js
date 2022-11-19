import { addDays, toDateString } from '../helpers/dateTimeUtils';

const defaultFitnessRange = {
  fitindex: [],
  google_fit: {
    calories: [],
    minutes: [],
    steps: [],
  },
  my_fitness_pal: [],
};

const defaultCalorieDeficits = {
  deficits: [],
  average_deficit: 0,
  total_deficit: 0,
  total_lbs: 0,
};

const fitnessState = {
  fitnessRange: defaultFitnessRange,
  fitnessDatesLoading: true,
  fitnessDates: [],
  fitnessDataRangeLoading: true,
  fitnessDateRange: {
    endDate: toDateString(new Date()),
    startDate: toDateString(addDays(new Date(), -30)),
  },
  config: {},
  configEditable: false,
  calorieDeltasLoading: true,
  calorieDeltas: defaultCalorieDeficits,
};

export { fitnessState };
