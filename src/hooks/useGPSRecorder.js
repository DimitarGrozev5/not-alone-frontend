import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGpsRecordTo } from "../redux-store/gpsThunks/changeGpsRecordThunk";

export const useGPSRecorder = () => {
  const dispatch = useDispatch();

  const recordGPS = useSelector((state) => state.gps.record);

  // Change status, based on local storage value
  useEffect(() => {
    const record = localStorage.getItem("record-gps") === "record";
    if (record) {
      dispatch(setGpsRecordTo(record));
    }
  }, [recordGPS, dispatch]);

  // Record gps data
  useEffect(() => {
    // let watchID;
    if (recordGPS) {
      if ("geolocation" in navigator) {
        const saveLocation = () => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
            },
            (err) => {
              console.log(err);
            },
            { enableHighAccuracy: true }
          );
        };
        // saveLocation();
        // setInterval(saveLocation, 15 * 60 * 1000);
        // watchID = navigator.geolocation.watchPosition(
        //   (position) => {
        //     console.log(position);
        //   },
        //   (err) => {
        //     console.log(err);
        //   }
        // );
      }
    }
    // return () => navigator.geolocation.clearWatch(watchID);
  }, [recordGPS]);
};
