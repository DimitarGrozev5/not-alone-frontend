import { useState } from "react";

export const useManageStops = (editStops) => {
  const [stops, setStops] = useState([{ text: "", duration: 0 }]);

  const onNameChangeHandler = (id) => (event) => {
    setStops((stops) => {
      const copy = [...stops];
      copy[id].text = event.target.value;
      return copy;
    });
  };
  const onDurationChangeHandler = (id) => (dt) => {
    setStops((stops) => {
      const copy = [...stops];

      copy[id].duration =
        copy[id].duration + dt < 0 ? 0 : copy[id].duration + dt;
      return copy;
    });
  };

  const onRemoveStopHandler = (id) => () => {
    setStops((stops) => {
      const copy = [...stops];
      copy.splice(id, 1);
      return copy;
    });
  };

  const addStopHandler = (event) => {
    event.preventDefault();
    setStops((stops) => [...stops, { text: "", duration: 0 }]);
  };

  return {
    stops,
    setStops,
    onNameChangeHandler,
    onDurationChangeHandler,
    onRemoveStopHandler,
    addStopHandler,
  };
};
