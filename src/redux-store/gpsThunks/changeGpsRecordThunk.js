import { gpsActions } from "../gpsSlice";

export const setGpsRecordTo = (value) => (dispatch, getState) => {
  localStorage.setItem("record-gps", !!value ? "record" : "no-record");
  dispatch(gpsActions.setRecordTo(!!value));
};
