import { isNotNil } from 'utils';

const nearestGreater = (val, max, step) => isNotNil(max)
  ? val + step <= max ? val + step : max
  : val + step;

const nearestLesser = (val, min, step) => isNotNil(min)
  ? val - step >= min ? val - step : min
  : val - step;

export const findNearest = (direction: 'up' | 'down', min, max, step, val) =>
  direction === 'up' ? nearestGreater(val, max, step) : nearestLesser(val, min, step);
