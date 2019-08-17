export const MILLISECOND = 1;
export const TICK = 200;
export const SECOND = 1000;
export const MINUTE = 60000;
export const HOUR = 3600000;
export const DAY = 86400000;

export const TURBO_PERIOD = MINUTE;
export const TURBO_INTERVAL = 0.5 * MINUTE;
export const BINARY_PERIOD = 15 * MINUTE;
export const BINARY_INTERVAL = 5 * MINUTE;

export const BINARY_TIME_CONFIG = {
  turbo: {
    period: TURBO_PERIOD,
    interval: TURBO_INTERVAL,
    count: 5,
  },
  binary: {
    period: BINARY_PERIOD,
    interval: BINARY_INTERVAL,
    count: 4,
  },
};
