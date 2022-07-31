export const getBattery = () =>
  navigator.getBattery().then((b) => ({
    level: b.level,
    dischargingTime: b.dischargingTime,
  }));
