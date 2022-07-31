export const getBattery = () =>
  navigator.getBattery().then((b) => ({
    level: b.level * 100,
  }));
