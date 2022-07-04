const extractMeasure = (duration, period) => {
  const measure = Math.floor(duration / period);
  return [measure, duration - measure * period];
};

export const TimeConst = {
  DAY: 24 * 60 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  MINUTE: 60 * 1000,
  SECOND: 1000,
};

export const deconstructDuration = (duration) => {
  const [days, left1] = extractMeasure(duration, TimeConst.DAY);
  const [hours, left2] = extractMeasure(left1, TimeConst.HOUR);
  const [minutes, left3] = extractMeasure(left2, TimeConst.MINUTE);
  const [seconds, miliseconds] = extractMeasure(left3, TimeConst.SECOND);

  return [miliseconds, seconds, minutes, hours, days];
};
