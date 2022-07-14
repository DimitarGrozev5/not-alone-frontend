export const validateTrip = (trip) => {
  // Name is not empty
  if (!trip.name.length) {
    throw new Error("Пътуването трябва да има име!");
  }

  // There is more than one stop
  if (trip.stops.length === 1) {
    throw new Error("Трябва да има поне две спирки!");
  }

  // Trip stops have name and non zero duration
  trip.stops.forEach(({ data, duration }, i) => {
    if (!data.stopName.length) {
      throw new Error("Спирките трябва да имат име!");
    }
    if (duration === 0 && i > 0) {
      throw new Error("Спирките трябва да имат положително време за пътуване!");
    }
  });

  // There is at least one watcher
  if (trip.watchers.new.length === 0) {
    throw new Error("Добавете поне един наблюдател!");
  }
};
